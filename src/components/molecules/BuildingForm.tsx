import React, { useEffect, useState } from 'react';
import { Building, Coordinate } from '../../hooks/useBuildings';
import { useTranslation } from 'react-i18next';
import Input from '../atoms/Input';
import MapPicker from './MapPicker';
import { MapPin } from 'lucide-react';

interface BuildingFormProps {
    initialData?: Building;
    onSubmit: (data: Omit<Building, 'id'>) => void;
}

const BuildingForm: React.FC<BuildingFormProps> = ({ initialData, onSubmit }) => {
    const { t } = useTranslation();
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [coordinate, setCoordinate] = useState<Coordinate>(
        initialData?.coordinate || { lat: -0.9482, lng: 100.3606 } // Default to campus center
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, description, coordinate });
    };

    return (
        <form id="building-form" onSubmit={handleSubmit} className="space-y-6">
            <Input
                label={t('buildings.name')}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Central Library"
            />

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {t('buildings.description')}
                </label>
                <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a brief description..."
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 resize-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-red-500" />
                    {t('buildings.location')}
                </label>
                <div className="h-64 w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    <MapPicker 
                        initialLocation={coordinate}
                        onLocationSelect={(lat, lng) => setCoordinate({ lat, lng })} 
                    />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>LAT: {coordinate.lat.toFixed(6)}</span>
                    <span>LNG: {coordinate.lng.toFixed(6)}</span>
                </div>
            </div>
        </form>
    );
};

export default BuildingForm;
