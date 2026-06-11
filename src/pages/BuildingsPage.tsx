import React, { useState } from 'react';
import { useBuildings, useCreateBuilding, useUpdateBuilding, useDeleteBuilding, Building, BuildingFilters } from '../hooks/useBuildings';
import { Building2, Plus, MapPin, Loader2, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/atoms/Button';
import Card, { CardContent, CardHeader } from '../components/atoms/Card';
import { useTranslation } from 'react-i18next';
import Modal from '../components/atoms/Modal';
import BuildingForm from '../components/molecules/BuildingForm';
import toast from 'react-hot-toast';

const BuildingsPage: React.FC = () => {
    const { t } = useTranslation();
    const [filters, setFilters] = useState<BuildingFilters>({ page: 1 });
    const { data: buildingsData, isLoading } = useBuildings(filters);
    const { mutate: createBuilding, isPending: isCreating } = useCreateBuilding();
    const { mutate: updateBuilding, isPending: isUpdating } = useUpdateBuilding();
    const { mutate: deleteBuilding, isPending: isDeleting } = useDeleteBuilding();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);

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

            {isLoading ? (
                <div className="p-12 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {buildingsData?.data.map((building) => (
                            <Card key={building.id} className="group hover:border-indigo-500 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                            <Building2 size={24} />
                                        </div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{building.name}</h3>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 min-h-[40px]">
                                        {building.description}
                                    </p>
                                    <div className="flex items-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg">
                                        <MapPin size={14} className="mr-1 text-red-500" />
                                        <span>{building.coordinate.lat.toFixed(4)}, {building.coordinate.lng.toFixed(4)}</span>
                                    </div>
                                </CardContent>
                                <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30 flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(building)}>
                                        <Edit size={14} className="mr-1" />
                                        {t('common.edit')}
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleDeleteClick(building.id)}
                                        disabled={isDeleting}
                                    >
                                        <Trash2 size={14} className="mr-1" />
                                        {t('common.delete')}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {buildingsData && buildingsData.meta.last_page > 1 && (
                        <div className="flex justify-center mt-8">
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page! - 1) }))}
                                    disabled={filters.page === 1}
                                >
                                    <ChevronLeft size={16} className="mr-1" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFilters(prev => ({ ...prev, page: Math.min(buildingsData.meta.last_page, prev.page! + 1) }))}
                                    disabled={filters.page === buildingsData.meta.last_page}
                                >
                                    Next
                                    <ChevronRight size={16} className="ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingBuilding ? t('buildings.edit_building') : t('buildings.add_building')}
                size="lg"
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
                />
            </Modal>
        </div>
    );
};

export default BuildingsPage;
