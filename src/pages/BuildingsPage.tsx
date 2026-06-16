import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBuildings, useCreateBuilding, useUpdateBuilding, useDeleteBuilding, Building, BuildingFilters } from '../hooks/useBuildings';
import { Building2, Plus, MapPin, Loader2, Edit, Trash2, ChevronLeft, ChevronRight, Search, ArrowUpDown } from 'lucide-react';
import Button from '../components/atoms/Button';
import Card, { CardContent } from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Modal from '../components/atoms/Modal';
import BuildingForm from '../components/molecules/BuildingForm';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const BuildingsPage: React.FC = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const q = searchParams.get('q') || '';
    const [filters, setFilters] = useState<BuildingFilters>({ page: 1, q });
    const [searchTerm, setSearchTerm] = useState(q);

    const { data: buildingsData, isLoading } = useBuildings(filters);
    const { mutate: createBuilding, isPending: isCreating } = useCreateBuilding();
    const { mutate: updateBuilding, isPending: isUpdating } = useUpdateBuilding();
    const { mutate: deleteBuilding, isPending: isDeleting } = useDeleteBuilding();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);

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

    const handleDeleteClick = (id: number) => {
        if (window.confirm(t('buildings.delete_confirm'))) {
            deleteBuilding(id, {
                onSuccess: () => toast.success('Building deleted successfully'),
            });
        }
    };

    const handleFormSubmit = (data: Omit<Building, 'id'>) => {
        if (editingBuilding) {
            updateBuilding({ ...data, id: editingBuilding.id }, {
                onSuccess: () => {
                    toast.success('Building updated successfully');
                    setIsModalOpen(false);
                },
            });
        } else {
            createBuilding(data, {
                onSuccess: () => {
                    toast.success('Building created successfully');
                    setIsModalOpen(false);
                },
            });
        }
    };

    return (
        <div className="space-y-6">
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

                {isLoading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                ) : (
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
                                    {buildingsData?.data.map((building) => (
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
                                                    onClick={() => handleDeleteClick(building.id)}
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
                            <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                <span className="text-sm text-slate-500">
                                    Showing {(buildingsData.meta.current_page - 1) * 10 + 1} to {Math.min(buildingsData.meta.current_page * 10, buildingsData.meta.total)} of {buildingsData.meta.total} buildings
                                </span>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
                                        disabled={(filters.page || 1) === 1}
                                    >
                                        <ChevronLeft size={16} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFilters(prev => ({ ...prev, page: Math.min(buildingsData.meta.last_page, (prev.page || 1) + 1) }))}
                                        disabled={(filters.page || 1) === buildingsData.meta.last_page}
                                    >
                                        <ChevronRight size={16} />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
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
