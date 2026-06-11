import React, { useState, useEffect } from 'react';
import { Facility } from '../../hooks/useFacilities';
import { useAllCategories } from '../../hooks/useCategories';
import { useAllBuildings } from '../../hooks/useBuildings';
import Input from '../atoms/Input';
import MapPicker from './MapPicker';
import { useTranslation } from 'react-i18next';

interface FacilityFormProps {
    initialData?: Partial<Facility>;
    onSubmit: (data: any) => void;
    isLoading?: boolean;
}

const FacilityForm: React.FC<FacilityFormProps> = ({ initialData, onSubmit, isLoading }) => {
    const { t } = useTranslation();
    const { data: categories } = useAllCategories();
    const { data: buildingsData } = useAllBuildings();
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category_id: '',
        building_id: '',
        coordinate: {
            lat: -0.9482,
            lng: 100.3606,
        },
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                category_id: initialData.category_id?.toString() || '',
                building_id: initialData.building_id?.toString() || '',
                coordinate: initialData.coordinate || { lat: -0.9482, lng: 100.3606 },
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            category_id: parseInt(formData.category_id),
            building_id: formData.building_id ? parseInt(formData.building_id) : null,
        });
    };

    return (
        <form id="facility-form" onSubmit={handleSubmit} className="space-y-4 py-2">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t('facilities.name')}
                </label>
                <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Toilet Floor 1"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t('facilities.description')}
                </label>
                <textarea
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional description"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        {t('facilities.category')}
                    </label>
                    <select
                        required
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    >
                        <option value="">Select Category</option>
                        {categories?.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        {t('facilities.building')}
                    </label>
                    <select
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.building_id}
                        onChange={(e) => setFormData({ ...formData, building_id: e.target.value })}
                    >
                        <option value="">None / Outside</option>
                        {buildingsData?.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t('facilities.location')}
                </label>
                <div className="h-64 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    <MapPicker
                        initialLocation={formData.coordinate}
                        onChange={(coord) => setFormData({ ...formData, coordinate: coord })}
                    />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                    {formData.coordinate.lat.toFixed(6)}, {formData.coordinate.lng.toFixed(6)}
                </p>
            </div>
        </form>
    );
};

export default FacilityForm;
