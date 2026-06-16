import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, PackageOpen } from 'lucide-react';
import { useFacility } from '../../hooks/useFacilities';
import Card from '../../components/atoms/Card';
import QueryStateHandler from '../../components/atoms/QueryStateHandler';

const FacilityShowPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: facility, isLoading, isError, error } = useFacility(id);
    
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <Link to="/map" className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="mr-2" size={16} /> Back to Map
            </Link>

            <QueryStateHandler
                isLoading={isLoading}
                isError={isError}
                error={error}
                data={facility}
                emptyState={{
                    icon: PackageOpen,
                    title: 'Facility not found',
                    description: 'The facility you are looking for does not exist or has been removed.'
                }}
            >
                {(resolvedFacility) => (
                    <Card className="p-6">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center mb-4">
                            <MapPin className="mr-3 text-red-500" /> {resolvedFacility.name}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">{resolvedFacility.description}</p>
                        {resolvedFacility.category && (
                            <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: `${resolvedFacility.category.color_code}20`, color: resolvedFacility.category.color_code }}>
                                {resolvedFacility.category.name}
                            </span>
                        )}
                    </Card>
                )}
            </QueryStateHandler>
        </div>
    );
};

export default FacilityShowPage;
