import React, { useState, useEffect } from 'react';
import { Category } from '../../hooks/useCategories';
import Input from '../atoms/Input';
import { useTranslation } from 'react-i18next';
import IconPicker from './IconPicker';

interface CategoryFormProps {
    initialData?: Partial<Category>;
    onSubmit: (data: any) => void;
    isLoading?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSubmit, isLoading }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        icon_marker: 'map-pin',
        color_code: '#4f46e5',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                icon_marker: initialData.icon_marker || 'map-pin',
                color_code: initialData.color_code || '#4f46e5',
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form id="category-form" onSubmit={handleSubmit} className="space-y-4 py-2">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t('categories.name')}
                </label>
                <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Plumbing, Electrical"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t('categories.icon')}
                </label>
                <IconPicker 
                    selectedIcon={formData.icon_marker}
                    onChange={(icon) => setFormData({ ...formData, icon_marker: icon })}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t('categories.color')}
                </label>
                <div className="flex space-x-2">
                    <Input
                        type="color"
                        required
                        value={formData.color_code}
                        onChange={(e) => setFormData({ ...formData, color_code: e.target.value })}
                        className="w-12 h-10 p-1"
                    />
                    <Input
                        required
                        value={formData.color_code}
                        onChange={(e) => setFormData({ ...formData, color_code: e.target.value })}
                        placeholder="#000000"
                        className="flex-1"
                    />
                </div>
            </div>
        </form>
    );
};

export default CategoryForm;
