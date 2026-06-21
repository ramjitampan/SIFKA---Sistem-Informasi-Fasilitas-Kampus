import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, PackageOpen, MapPin } from 'lucide-react';
import { useBuilding } from '../../hooks/useBuildings';
import Card, { CardContent } from '../../components/atoms/Card';
import QueryStateHandler from '../../components/atoms/QueryStateHandler';
import { useTranslation } from 'react-i18next';

const BuildingShowPage: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const { data: building, isLoading, isError, error } = useBuilding(id);
    
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <Link to="/buildings" className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="mr-2" size={16} /> Back to Buildings
            </Link>
            
            <QueryStateHandler
                isLoading={isLoading}
                isError={isError}
                error={error}
                data={building}
                emptyState={{
                    icon: PackageOpen,
                    title: 'Building not found',
                    description: 'The building you are looking for does not exist or has been removed.'
                }}
            >
                {(resolvedBuilding) => (
                    <div className="space-y-6">
                        <Card className="p-6">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center mb-4">
                                <Building2 className="mr-3 text-indigo-600" /> {resolvedBuilding.name}
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">{resolvedBuilding.description}</p>
                            <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm font-mono bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg w-fit">
                                <MapPin size={16} className="mr-2 text-red-500" />
                                {resolvedBuilding.coordinate.lat.toFixed(6)}, {resolvedBuilding.coordinate.lng.toFixed(6)}
                            </div>
                        </Card>

                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                                {t('nav.facilities')}
                            </h2>

                            {!resolvedBuilding.amenities || resolvedBuilding.amenities.length === 0 ? (
                                <Card className="p-8 text-center">
                                    <PackageOpen className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                                    <p className="text-slate-500 dark:text-slate-400">No facilities registered in this building.</p>
                                </Card>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {resolvedBuilding.amenities.map((facility) => (
                                        <Card key={facility.id} className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-semibold text-slate-900 dark:text-white">{facility.name}</h3>
                                                    {facility.category && (
                                                        <span 
                                                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
                                                            style={{ backgroundColor: facility.category.color_code }}
                                                        >
                                                            {facility.category.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                                                    {facility.description}
                                                </p>
                                                <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs font-mono">
                                                    <MapPin size={12} className="mr-1" />
                                                    {facility.coordinate.lat.toFixed(4)}, {facility.coordinate.lng.toFixed(4)}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </QueryStateHandler>
        </div>
    );
};

export default BuildingShowPage;
