import React, { useState } from 'react';
import MapView from '../components/organisms/MapView';
import { useBuildings } from '../hooks/useBuildings';
import { useFacilities } from '../hooks/useFacilities';
import { Search, Map as MapIcon } from 'lucide-react';
import Input from '../components/atoms/Input';
import { useTranslation } from 'react-i18next';
import QueryStateHandler from '../components/atoms/QueryStateHandler';

const MapPage: React.FC = () => {
    const { data: buildingsData, isLoading: isLoadingBuildings, isError: isErrorBuildings, error: errorBuildings } = useBuildings();
    const { data: facilitiesData, isLoading: isLoadingFacilities, isError: isErrorFacilities, error: errorFacilities } = useFacilities();
    const [searchQuery, setSearchQuery] = useState('');
    const { t } = useTranslation();

    const isLoading = isLoadingBuildings || isLoadingFacilities;
    const isError = isErrorBuildings || isErrorFacilities;
    const error = errorBuildings || errorFacilities;
    
    // Combined data for QueryStateHandler
    const data = buildingsData && facilitiesData ? { 
        buildings: buildingsData.data, 
        facilities: facilitiesData.data 
    } : null;

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

            <QueryStateHandler
                isLoading={isLoading}
                isError={isError}
                error={error}
                data={data}
                emptyState={{
                    icon: MapIcon,
                    title: 'Map Data Unavailable',
                    description: 'We could not load the map data at this time.'
                }}
            >
                {(resolvedData) => {
                    const filteredBuildings = resolvedData.buildings.filter(b => 
                        b.name.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    const filteredFacilities = resolvedData.facilities.filter(f => 
                        f.name.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    return (
                        <MapView 
                            buildings={filteredBuildings} 
                            facilities={filteredFacilities} 
                        />
                    );
                }}
            </QueryStateHandler>
        </div>
    );
};

export default MapPage;
