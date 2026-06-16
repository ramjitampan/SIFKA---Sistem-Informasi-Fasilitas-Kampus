import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateReport } from '../../hooks/useReports';
import { useFacilities } from '../../hooks/useFacilities';
import { 
    ArrowLeft, 
    Upload, 
    MapPin, 
    AlertCircle,
    Loader2,
    Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import MapPicker from '../../components/molecules/MapPicker';
import toast from 'react-hot-toast';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import Card, { CardContent } from '../../components/atoms/Card';
import { useTranslation } from 'react-i18next';

const CreateReportPage: React.FC = () => {
    const navigate = useNavigate();
    const { mutate: createReport, isPending } = useCreateReport();
    const { data: facilitiesData } = useFacilities();
    const facilities = facilitiesData?.data ?? [];
    const { t } = useTranslation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [facilityId, setFacilityId] = useState<string>('');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!latitude || !longitude) {
            toast.error(t('reports.pin_location'));
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('latitude', latitude.toString());
        formData.append('longitude', longitude.toString());
        if (facilityId) formData.append('facility_id', facilityId);
        if (image) formData.append('image', image);

        createReport(formData, {
            onSuccess: () => {
                toast.success(t('common.submit') + ' ' + t('reports.status.resolved')); // Fallback toast or add dedicated key
                navigate('/reports');
            },
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link to="/reports" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ArrowLeft className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('reports.create_title')}</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Details */}
                <Card>
                    <CardContent className="space-y-6">
                        <Input
                            label={t('reports.report_title')}
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Broken AC in Room 204"
                        />

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {t('reports.description')}
                            </label>
                            <textarea
                                required
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Provide details about the issue..."
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 resize-none"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {t('reports.facility_optional')}
                            </label>
                            <select
                                value={facilityId}
                                onChange={(e) => setFacilityId(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            >
                                <option value="">Select a facility</option>
                                {facilities.map((f) => (
                                    <option key={f.id} value={f.id}>{f.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {t('reports.attach_photo')}
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    {imagePreview ? (
                                        <div className="relative w-full h-full p-2">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-md" />
                                            <div className="absolute top-1 right-1 bg-indigo-600 text-white p-1 rounded-full">
                                                <Check className="h-3 w-3" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="h-8 w-8 text-slate-400 mb-2" />
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Click to upload (JPG, PNG)</p>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Location */}
                <Card className="flex flex-col">
                    <CardContent className="flex-1 space-y-4">
                        <label className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-red-500" />
                            {t('reports.pin_location')}
                        </label>
                        <div className="h-[400px] w-full">
                            <MapPicker onChange={(coords) => {
                                setLatitude(coords.lat);
                                setLongitude(coords.lng);
                            }} />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Click on the map to pinpoint where the issue is located.
                        </p>
                    </CardContent>

                    <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-700 mt-auto">
                        <div className="flex items-center text-sm text-amber-600 dark:text-amber-400 mb-4 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                            <span>{t('reports.accuracy_warning')}</span>
                        </div>
                        
                        <Button
                            type="submit"
                            isLoading={isPending}
                            className="w-full"
                            size="lg"
                        >
                            {isPending ? t('reports.submitting') : t('reports.submit_report')}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default CreateReportPage;

