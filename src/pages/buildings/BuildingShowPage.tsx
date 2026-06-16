import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, PackageOpen } from 'lucide-react';
import { useBuilding } from '../../hooks/useBuildings';
import Card from '../../components/atoms/Card';
import QueryStateHandler from '../../components/atoms/QueryStateHandler';

const BuildingShowPage: React.FC = () => {
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
                    <Card className="p-6">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center mb-4">
                            <Building2 className="mr-3 text-indigo-600" /> {resolvedBuilding.name}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">{resolvedBuilding.description}</p>
                    </Card>
                )}
            </QueryStateHandler>
        </div>
    );
};

export default BuildingShowPage;
