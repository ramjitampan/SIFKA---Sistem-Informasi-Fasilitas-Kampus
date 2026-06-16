import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useReports, useReportUpdates, useDeleteReport } from '../../hooks/useReports';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { 
    Clock, 
    CheckCircle2, 
    Plus, 
    Filter,
    ChevronLeft,
    ChevronRight,
    Loader2,
    MapPin,
    FileText,
    Trash2,
    XCircle,
    PackageOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import Badge from '../../components/atoms/Badge';
import Button from '../../components/atoms/Button';
import Card, { CardHeader, CardContent } from '../../components/atoms/Card';
import QueryStateHandler from '../../components/atoms/QueryStateHandler';

const statusConfig = {
    pending: { label: 'Pending', icon: Clock, variant: 'warning' as const },
    in_progress: { label: 'In Progress', icon: Loader2, variant: 'info' as const },
    resolved: { label: 'Resolved', icon: CheckCircle2, variant: 'success' as const },
    rejected: { label: 'Rejected', icon: XCircle, variant: 'error' as const },
};


const ReportsPage: React.FC = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const q = searchParams.get('q') || '';
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string | undefined>();
    
    const { data: reportsData, isLoading, isError, error } = useReports(page, statusFilter);
    const { mutateAsync: deleteReport } = useDeleteReport();
    const { user } = useAuthStore();
    
    // Enable real-time updates
    useReportUpdates();

    const handleStatusFilter = (status?: string) => {
        setStatusFilter(status);
        setPage(1);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this report?')) {
            toast.promise(deleteReport(id), {
                loading: 'Deleting report...',
                success: 'Report deleted successfully',
                error: (err) => err?.response?.data?.message || 'Failed to delete report',
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('reports.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t('reports.subtitle')}</p>
                </div>

                <Link to="/reports/create">
                    <Button>
                        <Plus className="mr-2 h-5 w-5" />
                        {t('reports.new_report')}
                    </Button>
                </Link>
            </div>

            {/* Status Summary Cards */}
            {reportsData?.status_counts && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(['pending', 'in_progress', 'resolved', 'rejected'] as const).map((status) => {
                        const config = statusConfig[status];
                        return (
                            <button
                                key={status}
                                onClick={() => handleStatusFilter(status === statusFilter ? undefined : status)}
                                className={`p-4 rounded-xl border transition-all text-left ${
                                    statusFilter === status 
                                        ? 'border-indigo-500 ring-2 ring-indigo-500 ring-opacity-20 bg-indigo-50 dark:bg-indigo-900/20' 
                                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <config.icon className={`h-5 w-5 ${statusFilter === status ? 'text-indigo-600' : 'text-slate-400'}`} />
                                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                                        {reportsData.status_counts[status]}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    {t(`reports.status.${status}`)}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Reports List */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{t('reports.recent_reports')}</h3>
                    <div className="flex items-center text-sm text-slate-500">
                        <Filter className="h-4 w-4 mr-2" />
                        <span>Filtering: {statusFilter ? t(`reports.status.${statusFilter}`) : 'All'}</span>
                    </div>
                </CardHeader>

                <QueryStateHandler
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    data={reportsData?.data}
                    emptyState={{
                        icon: PackageOpen,
                        title: 'No reports found',
                        description: 'There are no reports matching your criteria.',
                        action: (
                            <Link to="/reports/create">
                                <Button variant="outline" size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Report
                                </Button>
                            </Link>
                        )
                    }}
                >
                    {(reports) => (
                        <>
                            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                {reports.map((report) => {
                                    const status = statusConfig[report.status as keyof typeof statusConfig] || statusConfig.pending;
                                    return (
                                        <Link 
                                            key={report.id} 
                                            to={`/reports/${report.id}`}
                                            className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                                        >
                                            <div className="flex flex-col md:flex-row gap-4">
                                                {report.image_url ? (
                                                    <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-700">
                                                        <img src={report.image_url} alt={report.title} className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-full md:w-32 h-32 rounded-lg flex-shrink-0 bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                                        <FileText className="h-8 w-8 text-slate-400" />
                                                    </div>
                                                )}
                                                
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 dark:text-white">{report.title}</h4>
                                                            <div className="flex items-center text-xs text-slate-500 space-x-3 mt-1">
                                                                <span>By {report.user.name}</span>
                                                                <span>•</span>
                                                                <span>{new Date(report.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            {(user?.role === 'admin' || user?.id === report.user.id) && (
                                                                <button 
                                                                    onClick={(e) => { e.preventDefault(); handleDelete(report.id); }}
                                                                    className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            )}
                                                            <Badge variant={status.variant} icon={status.icon}>
                                                                {t(`reports.status.${report.status}`)}
                                                            </Badge>
                                                        </div>
                                                        </div>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                                        {report.description}
                                                    </p>

                                                    <div className="flex items-center text-xs text-slate-500">
                                                        <MapPin className="h-3 w-3 mr-1" />
                                                        <span>{report.facility?.name || 'Unknown Location'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {reportsData && reportsData.meta.last_page > 1 && (
                                <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                    <span className="text-sm text-slate-500">
                                        Page {reportsData.meta.current_page} of {reportsData.meta.last_page}
                                    </span>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.min(reportsData.meta.last_page, p + 1))}
                                            disabled={page === reportsData.meta.last_page}
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </QueryStateHandler>
            </Card>
        </div>
    );
};

export default ReportsPage;

