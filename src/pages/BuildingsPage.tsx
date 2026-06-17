import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBuildings, useCreateBuilding, useUpdateBuilding, useDeleteBuilding, Building, BuildingFilters } from '../hooks/useBuildings';
import { Building2, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Button from '../components/atoms/Button';
import Card, { CardContent } from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Modal from '../components/atoms/Modal';
import BuildingForm from '../components/molecules/BuildingForm';
import QueryStateHandler from '../components/atoms/QueryStateHandler';
import Pagination from '../components/atoms/Pagination';
import DeleteConfirmationModal from '../components/atoms/DeleteConfirmationModal';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const BuildingsPage: React.FC = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const q = searchParams.get('q') || '';
    const [filters, setFilters] = useState<BuildingFilters>({ page: 1, q });
    const [searchTerm, setSearchTerm] = useState(q);

    const { data: buildingsData, isLoading, isError, error } = useBuildings(filters);
    const { mutateAsync: createBuilding, isPending: isCreating } = useCreateBuilding();
    const { mutateAsync: updateBuilding, isPending: isUpdating } = useUpdateBuilding();
    const { mutateAsync: deleteBuilding, isPending: isDeleting } = useDeleteBuilding();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [buildingToDelete, setBuildingToDelete] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, q: searchTerm, page: 1 }));
    };

    const handleAddClick = () => {
        setEditingBuilding(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (building: Building) => {
        setEditingBuilding(building);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (buildingToDelete) {
            toast.promise(deleteBuilding(buildingToDelete), {
                loading: 'Deleting building...',
                success: 'Building deleted successfully',
                error: (err) => err?.response?.data?.message || 'Failed to delete building',
            });
            setIsDeleteModalOpen(false);
            setBuildingToDelete(null);
        }
    };

    const handleFormSubmit = async (data: Omit<Building, 'id'>) => {
        const promise = editingBuilding 
            ? updateBuilding({ ...data, id: editingBuilding.id })
            : createBuilding(data);

        toast.promise(promise, {
            loading: editingBuilding ? 'Updating building...' : 'Creating building...',
            success: editingBuilding ? 'Building updated successfully' : 'Building created successfully',
            error: (err) => err?.response?.data?.message || `Failed to ${editingBuilding ? 'update' : 'create'} building`,
        });

        try {
            await promise;
            setIsModalOpen(false);
        } catch (error) {
            // Error handled by toast.promise
        }
    };

    return (
        <div className="space-y-6">
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title={t('buildings.delete_title')}
                description={t('buildings.delete_desc')}
                isDeleting={isDeleting}
            />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('buildings.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t('buildings.subtitle')}</p>
                </div>

                <Button onClick={handleAddClick}>
                    <Plus className="mr-2 h-5 w-5" />
                    {t('buildings.add_building')}
                </Button>
            </div>

            <Card>
                <CardContent className="p-4 border-b border-slate-100 dark:border-slate-700">
                    <form onSubmit={handleSearch} className="relative w-full max-w-sm">
                        <Input
                            placeholder={t('common.search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    </form>
                </CardContent>

                <QueryStateHandler
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    data={buildingsData?.data}
                    emptyState={{
                        icon: Building2,
                        title: 'No buildings found',
                        description: 'Try adjusting your search or add a new building.',
                        action: (
                            <Button variant="outline" size="sm" onClick={handleAddClick}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Building
                            </Button>
                        )
                    }}
                >
                    {(buildings) => (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('buildings.name')}</th>
                                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('buildings.description')}</th>
                                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Coordinates</th>
                                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">{t('common.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {buildings.map((building) => (
                                            <tr key={building.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                                                <td className="p-4 font-medium text-slate-900 dark:text-white flex items-center">
                                                    <Building2 className="mr-3 h-5 w-5 text-indigo-600" />
                                                    {building.name}
                                                </td>
                                                <td className="p-4 text-sm text-slate-600 dark:text-slate-400 truncate max-w-xs">{building.description}</td>
                                                <td className="p-4 text-sm text-slate-500 font-mono">
                                                    {building.coordinate.lat.toFixed(4)}, {building.coordinate.lng.toFixed(4)}
                                                </td>
                                                <td className="p-4 text-right space-x-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(building)}>
                                                        <Edit size={14} />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => {
                                                            setBuildingToDelete(building.id);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        disabled={isDeleting}
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {buildingsData && buildingsData.meta.last_page > 1 && (
                                <Pagination
                                    currentPage={buildingsData.meta.current_page}
                                    totalPages={buildingsData.meta.last_page}
                                    onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}

                                />
                            )}
                        </>
                    )}
                </QueryStateHandler>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingBuilding ? t('buildings.edit_building') : t('buildings.add_building')}
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button 
                            type="submit" 
                            form="building-form" 
                            isLoading={isCreating || isUpdating}
                        >
                            {t('common.save')}
                        </Button>
                    </>
                }
            >
                <BuildingForm 
                    initialData={editingBuilding || undefined} 
                    onSubmit={handleFormSubmit} 
                    isLoading={isCreating || isUpdating}
                />
            </Modal>
        </div>
    );
};

export default BuildingsPage;
