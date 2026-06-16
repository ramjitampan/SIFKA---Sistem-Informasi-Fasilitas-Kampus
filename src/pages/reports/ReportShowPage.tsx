import React from 'react';
import { useParams, Link } from 'react-router-dom';
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
    PackageOpen,
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
import QueryStateHandler from '../../components/atoms/QueryStateHandler';

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
    const { id: idStr } = useParams<{ id: string }>();
    const id = idStr ? parseInt(idStr) : undefined;
    const { user: currentUser } = useAuthStore();
    const { data: report, isLoading, isError, error } = useReport(id);
    const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateReportStatus();
    const { t } = useTranslation();
    
    useReportUpdates();

    const handleStatusUpdate = (newStatus: string) => {
        if (!report) return;
        toast.promise(updateStatus({ id: report.id, status: newStatus }), {
            loading: 'Updating status...',
            success: t('reports.update_status') + ': ' + t(`reports.status.${newStatus}`),
            error: (err) => err?.response?.data?.message || 'Failed to update status',
        });
    };

    const canUpdateStatus = currentUser?.role === 'admin' || currentUser?.role === 'staff';

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link to="/reports" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ArrowLeft className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {report ? report.title : 'Report Details'}
                    </h1>
                    {report && <p className="text-sm text-slate-500">Report #{report.id}</p>}
                </div>
            </div>

            <QueryStateHandler
                isLoading={isLoading}
                isError={isError}
                error={error}
                data={report}
                emptyState={{
                    icon: PackageOpen,
                    title: 'Report not found',
                    description: 'The report you are looking for does not exist or has been removed.'
                }}
            >
                {(resolvedReport) => {
                    const status = statusConfig[resolvedReport.status as keyof typeof statusConfig] || statusConfig.pending;
                    
                    return (
                        <div className="space-y-6">
                            <div className="flex justify-end">
                                <Badge variant={status.variant} icon={status.icon} className="px-3 py-1 text-sm">
                                    {t(status.label)}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Main Content */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Description & Image */}
                                    <Card>
                                        {resolvedReport.image_url && (
                                            <div className="w-full h-96 bg-slate-100 dark:bg-slate-900">
                                                <img src={resolvedReport.image_url} alt={resolvedReport.title} className="w-full h-full object-contain" />
                                            </div>
                                        )}
                                        <CardContent className="space-y-4">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                                                <MessageSquare className="h-5 w-5 mr-2 text-indigo-500" />
                                                {t('reports.description')}
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                                                {resolvedReport.description}
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
                                            <MapContainer center={[resolvedReport.coordinate.lat, resolvedReport.coordinate.lng]} zoom={17} className="h-full w-full">
                                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                <Marker position={[resolvedReport.coordinate.lat, resolvedReport.coordinate.lng]} icon={defaultIcon}>
                                                    <Popup>{resolvedReport.title}</Popup>
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
                                                                variant={resolvedReport.status === s ? 'primary' : 'outline'}
                                                                disabled={isUpdating || resolvedReport.status === s}
                                                                onClick={() => handleStatusUpdate(s)}
                                                                className="justify-between w-full"
                                                            >
                                                                <div className="flex items-center">
                                                                    <config.icon className={`h-4 w-4 mr-2 ${resolvedReport.status === s ? 'text-white' : ''}`} />
                                                                    {t(config.label)}
                                                                </div>
                                                                {resolvedReport.status === s && <CheckCircle2 className="h-4 w-4" />}
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
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{resolvedReport.user.name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3">
                                                    <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs text-slate-500">{t('reports.date_reported')}</p>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                            {new Date(resolvedReport.created_at).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                {resolvedReport.facility && (
                                                    <div className="flex items-start space-x-3">
                                                        <Building2 className="h-5 w-5 text-slate-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs text-slate-500">{t('reports.related_facility')}</p>
                                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{resolvedReport.facility.name}</p>
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
                }}
            </QueryStateHandler>
        </div>
    );
};

export default ReportShowPage;

