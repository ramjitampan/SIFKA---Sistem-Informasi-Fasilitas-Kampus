import React, { useState } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, Category, CategoryFilters } from '../hooks/useCategories';
import { 
    Tag, 
    Trash2, 
    Plus, 
    Edit, 
    ChevronLeft, 
    ChevronRight,
    Search,
    PackageOpen
} from 'lucide-react';
import * as Icons from 'lucide-react';
import Button from '../components/atoms/Button';
import Card, { CardContent } from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Modal from '../components/atoms/Modal';
import CategoryForm from '../components/molecules/CategoryForm';
import QueryStateHandler from '../components/atoms/QueryStateHandler';
import DeleteConfirmationModal from '../components/atoms/DeleteConfirmationModal';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const CategoriesPage: React.FC = () => {
    const { t } = useTranslation();
    const [filters, setFilters] = useState<CategoryFilters>({
        page: 1
    });

    const { data: categoriesData, isLoading, isError, error } = useCategories(filters);
    const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory();
    const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory();
    const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    };

    const handleAddClick = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

    const handleEditClick = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (categoryToDelete) {
            toast.promise(deleteCategory(categoryToDelete), {
                loading: 'Deleting category...',
                success: 'Category deleted successfully',
                error: (err) => err?.response?.data?.message || 'Failed to delete category',
            });
            setIsDeleteModalOpen(false);
            setCategoryToDelete(null);
        }
    };

    const handleFormSubmit = async (data: any) => {
        const promise = editingCategory 
            ? updateCategory({ id: editingCategory.id, ...data })
            : createCategory(data);

        toast.promise(promise, {
            loading: editingCategory ? 'Updating category...' : 'Creating category...',
            success: editingCategory ? 'Category updated successfully' : 'Category created successfully',
            error: (err) => err?.response?.data?.message || `Failed to ${editingCategory ? 'update' : 'create'} category`,
        });

        try {
            await promise;
            setIsModalOpen(false);
        } catch (error) {
            // Error handled by toast.promise
        }
    };

    const toPascalCase = (str: string) => {
        return str
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    };

    return (
        <div className="space-y-6">
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title={t('categories.delete_title')}
                description={t('categories.delete_desc')}
                isDeleting={isDeleting}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('categories.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t('categories.subtitle')}</p>
                </div>
                <Button onClick={handleAddClick}>
                    <Plus className="mr-2 h-5 w-5" />
                    {t('categories.add_button')}
                </Button>
            </div>

            <Card>
                <CardContent className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-center">
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
                    data={categoriesData?.data}
                    emptyState={{
                        icon: PackageOpen,
                        title: 'No categories found',
                        description: 'Try adjusting your search or add a new category.',
                        action: (
                            <Button variant="outline" size="sm" onClick={handleAddClick}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Category
                            </Button>
                        )
                    }}
                >
                    {(categories) => (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('categories.category')}</th>
                                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('categories.icon')}</th>
                                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('categories.color')}</th>
                                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('categories.facilities_count')}</th>
                                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">{t('common.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {categories.map((category) => (
                                            <tr key={category.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div 
                                                            className="h-10 w-10 rounded-lg flex items-center justify-center text-white"
                                                            style={{ backgroundColor: category.color_code }}
                                                        >
                                                            {(() => {
                                                                const IconName = toPascalCase(category.icon_marker) as keyof typeof Icons;
                                                                const Icon = (Icons as any)[IconName] || Icons.Tag;
                                                                return <Icon size={20} />;
                                                            })()}
                                                        </div>
                                                        <span className="font-medium text-slate-900 dark:text-white">{category.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center text-slate-500 dark:text-slate-400">
                                                        {(() => {
                                                            const IconName = toPascalCase(category.icon_marker) as keyof typeof Icons;
                                                            const Icon = (Icons as any)[IconName] || Icons.HelpCircle;
                                                            return <Icon size={16} className="mr-2" />;
                                                        })()}
                                                        <span className="text-sm font-mono">{category.icon_marker}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center space-x-2">
                                                        <div 
                                                            className="h-4 w-4 rounded-full border border-slate-200 dark:border-slate-600"
                                                            style={{ backgroundColor: category.color_code }}
                                                        />
                                                        <span className="text-sm font-mono text-slate-500">{category.color_code}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-sm text-slate-500">{category.facilities_count || 0}</span>
                                                </td>
                                                <td className="p-4 text-right space-x-2">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => handleEditClick(category)}
                                                    >
                                                        <Edit size={14} />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => {
                                                            setCategoryToDelete(category.id);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        disabled={isDeleting}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                            {categoriesData && categoriesData.meta.last_page > 1 && (
                                <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                    <span className="text-sm text-slate-500">
                                        Showing {(categoriesData.meta.current_page - 1) * categoriesData.meta.per_page + 1} to {Math.min(categoriesData.meta.current_page * categoriesData.meta.per_page, categoriesData.meta.total)} of {categoriesData.meta.total} categories
                                    </span>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page! - 1) }))}
                                            disabled={filters.page === 1}
                                        >
                                            <ChevronLeft size={16} />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setFilters(prev => ({ ...prev, page: Math.min(categoriesData.meta.last_page, prev.page! + 1) }))}
                                            disabled={filters.page === facilitiesData.meta.last_page}
                                        >
                                            <ChevronRight size={16} />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </QueryStateHandler>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCategory ? 'Edit Category' : 'Add New Category'}
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button 
                            type="submit" 
                            form="category-form" 
                            isLoading={isCreating || isUpdating}
                        >
                            {t('common.save')}
                        </Button>
                    </>
                }
            >
                <CategoryForm 
                    initialData={editingCategory || undefined} 
                    onSubmit={handleFormSubmit} 
                    isLoading={isCreating || isUpdating}
                />
            </Modal>
        </div>
    );
};

export default CategoriesPage;
