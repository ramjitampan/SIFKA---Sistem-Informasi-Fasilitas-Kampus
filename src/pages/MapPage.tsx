import React, { useState } from 'react';
import MapView from '../components/organisms/MapView';
import { useBuildings } from '../hooks/useBuildings';
import { useFacilities } from '../hooks/useFacilities';
import { Search, Loader2 } from 'lucide-react';
import Input from '../components/atoms/Input';
import Card from '../components/atoms/Card';
import { useTranslation } from 'react-i18next';

const MapPage: React.FC = () => {
    const { data: buildingsData, isLoading: isLoadingBuildings } = useBuildings();
    const { data: facilitiesData, isLoading: isLoadingFacilities } = useFacilities();
    const [searchQuery, setSearchQuery] = useState('');
    const { t } = useTranslation();

    const isLoading = isLoadingBuildings || isLoadingFacilities;

    const buildings = buildingsData?.data || [];
    const facilities = facilitiesData?.data || [];

    // Basic client-side filter for now, Meilisearch integration can be added to a dedicated search bar
    const filteredBuildings = buildings.filter(b => 
        b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredFacilities = facilities.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('map.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t('map.subtitle')}</p>
                </div>

                <div className="relative max-w-sm w-full">
                    <Input
                        placeholder={t('map.search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                    <div className="absolute top-2.5 left-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <Card className="h-[calc(100vh-200px)] w-full flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4" />
                        <p className="text-slate-500">{t('map.loading')}</p>
                    </div>
                </Card>
            ) : (
                <MapView 
                    buildings={filteredBuildings} 
                    facilities={filteredFacilities} 
                />
            )}
        </div>
    );
};

export default MapPage;

