import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Building2 } from 'lucide-react';
import { useBuilding } from '../../hooks/useBuildings';
import Card from '../../components/atoms/Card';

const BuildingShowPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: building, isLoading } = useBuilding(id);
    
    if (isLoading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <Link to="/buildings" className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="mr-2" size={16} /> Back to Buildings
            </Link>
            {building ? (
                <Card className="p-6">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center mb-4">
                        <Building2 className="mr-3 text-indigo-600" /> {building.name}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">{building.description}</p>
                </Card>
            ) : (
                <p>Building not found.</p>
            )}
        </div>
    );
};

export default BuildingShowPage;
