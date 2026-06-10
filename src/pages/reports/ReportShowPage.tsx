import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useReport, useUpdateReportStatus, useReportUpdates } from '../../hooks/useReports';
import { 
    ArrowLeft, 
    Clock, 
    CheckCircle2, 
    Loader2, 
    XCircle, 
    MapPin, 
    Calendar, 
    User,
    Building2,
    MessageSquare,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import Badge from '../../components/atoms/Badge';
import Button from '../../components/atoms/Button';
import Card, { CardHeader, CardContent } from '../../components/atoms/Card';
import { useTranslation } from 'react-i18next';

const defaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const statusConfig = {
    pending: { label: 'reports.status.pending', icon: Clock, variant: 'warning' as const },
    in_progress: { label: 'reports.status.in_progress', icon: Loader2, variant: 'info' as const },
    resolved: { label: 'reports.status.resolved', icon: CheckCircle2, variant: 'success' as const },
    rejected: { label: 'reports.status.rejected', icon: XCircle, variant: 'error' as const },
};

const ReportShowPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user: currentUser } = useAuthStore();
    const { data: report, isLoading } = useReport(id);
    const { mutate: updateStatus, isPending: isUpdating } = useUpdateReportStatus();
    const { t } = useTranslation();
    
    useReportUpdates();

    const handleStatusUpdate = (newStatus: string) => {
        if (!report) return;
        updateStatus({ id: report.id, status: newStatus }, {
            onSuccess: () => toast.success(t('reports.update_status') + ': ' + t(`reports.status.${newStatus}`)),
        });
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!report) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold">{t('common.no_data')}</h2>
                <Link to="/reports" className="text-indigo-600 hover:underline mt-2 inline-block">{t('common.back')}</Link>
            </div>
        );
    }

    const status = statusConfig[report.status as keyof typeof statusConfig] || statusConfig.pending;
    const canUpdateStatus = currentUser?.role === 'admin' || currentUser?.role === 'staff';

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to="/reports" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{report.title}</h1>
                        <p className="text-sm text-slate-500">Report #{report.id}</p>
                    </div>
                </div>
                <Badge variant={status.variant} icon={status.icon} className="px-3 py-1 text-sm">
                    {t(status.label)}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description & Image */}
                    <Card>
                        {report.image_url && (
                            <div className="w-full h-96 bg-slate-100 dark:bg-slate-900">
                                <img src={report.image_url} alt={report.title} className="w-full h-full object-contain" />
                            </div>
                        )}
                        <CardContent className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                                <MessageSquare className="h-5 w-5 mr-2 text-indigo-500" />
                                {t('reports.description')}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                                {report.description}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Location Map */}
                    <Card>
                        <CardHeader className="flex flex-row items-center py-4">
                            <MapPin className="h-5 w-5 mr-2 text-red-500" />
                            <h3 className="font-semibold text-slate-900 dark:text-white">{t('reports.location')}</h3>
                        </CardHeader>
                        <div className="h-64 w-full">
                            <MapContainer center={[report.coordinate.lat, report.coordinate.lng]} zoom={17} className="h-full w-full">
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[report.coordinate.lat, report.coordinate.lng]} icon={defaultIcon}>
                                    <Popup>{report.title}</Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Status Update (Staff/Admin Only) */}
                    {canUpdateStatus && (
                        <Card>
                            <CardContent className="space-y-4">
                                <h3 className="font-semibold text-slate-900 dark:text-white">{t('reports.update_status')}</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((s) => {
                                        const config = statusConfig[s];
                                        return (
                                            <Button
                                                key={s}
                                                variant={report.status === s ? 'primary' : 'outline'}
                                                disabled={isUpdating || report.status === s}
                                                onClick={() => handleStatusUpdate(s)}
                                                className="justify-between w-full"
                                            >
                                                <div className="flex items-center">
                                                    <config.icon className={`h-4 w-4 mr-2 ${report.status === s ? 'text-white' : ''}`} />
                                                    {t(config.label)}
                                                </div>
                                                {report.status === s && <CheckCircle2 className="h-4 w-4" />}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Metadata */}
                    <Card>
                        <CardContent className="space-y-4">
                            <h3 className="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">{t('reports.details')}</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <User className="h-5 w-5 text-slate-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-slate-500">{t('reports.reported_by')}</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{report.user.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-slate-500">{t('reports.date_reported')}</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            {new Date(report.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                {report.facility && (
                                    <div className="flex items-start space-x-3">
                                        <Building2 className="h-5 w-5 text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-slate-500">{t('reports.related_facility')}</p>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{report.facility.name}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ReportShowPage;

