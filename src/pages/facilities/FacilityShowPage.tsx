import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, MapPin } from 'lucide-react';
import { useFacilities } from '../../hooks/useFacilities';
import Card from '../../components/atoms/Card';

const FacilityShowPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: facilities, isLoading } = useFacilities();
    
    const facility = facilities?.find(f => f.id.toString() === id);

    if (isLoading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <Link to="/map" className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="mr-2" size={16} /> Back to Map
            </Link>
            {facility ? (
                <Card className="p-6">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center mb-4">
                        <MapPin className="mr-3 text-red-500" /> {facility.name}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">{facility.description}</p>
                    {facility.category && (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: `${facility.category.color_code}20`, color: facility.category.color_code }}>
                            {facility.category.name}
                        </span>
                    )}
                </Card>
            ) : (
                <p>Facility not found.</p>
            )}
        </div>
    );
};

export default FacilityShowPage;
