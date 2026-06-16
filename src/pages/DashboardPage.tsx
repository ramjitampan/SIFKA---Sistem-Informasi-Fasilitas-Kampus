import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useReports, useMarkReportAsSeen } from '../hooks/useReports';
import { 
    Clock, 
    CheckCircle2, 
    Loader2, 
    XCircle, 
    FileText,
    TrendingUp,
    MapPin
} from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/atoms/Card';
import Badge from '../components/atoms/Badge';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const statusConfig = {
    pending: { label: 'reports.status.pending', icon: Clock, variant: 'warning' as const },
    in_progress: { label: 'reports.status.in_progress', icon: Loader2, variant: 'info' as const },
    resolved: { label: 'reports.status.resolved', icon: CheckCircle2, variant: 'success' as const },
    rejected: { label: 'reports.status.rejected', icon: XCircle, variant: 'error' as const },
};

const DashboardPage: React.FC = () => {
    const { user } = useAuthStore();
    const isStudent = user?.role === 'student';
    const { data: reportsData, isLoading } = useReports(1, undefined, !isStudent);
    const { mutate: markAsSeen } = useMarkReportAsSeen();
    const { t } = useTranslation();

    const handleReportClick = (id: number) => {
        if (!isStudent) {
            markAsSeen(id);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {t('dashboard.welcome', { name: user?.name })}
                </h1>
                <p className="text-slate-500 dark:text-slate-400">{t('dashboard.subtitle')}</p>
            </div>

            {isStudent && (
                <div className="bg-indigo-600 rounded-xl p-6 text-white flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold">Need to report an issue?</h2>
                        <p className="text-indigo-100">Submit a new facility report and track its progress.</p>
                    </div>
                    <Link to="/reports/create" className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold hover:bg-indigo-50 transition">
                        Submit New Report
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                            <TrendingUp className="mr-2 h-5 w-5 text-indigo-500" />
                            {isStudent ? 'My Reports' : t('dashboard.recent_reports')}
                        </h2>
                        <Link to="/reports" className="text-sm text-indigo-600 hover:underline">{t('dashboard.view_all')}</Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-8 flex justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                            </div>
                        ) : reportsData?.data.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                {isStudent ? 'You haven\'t submitted any reports yet.' : t('common.no_data')}
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                {reportsData?.data.map((report) => {
                                    const status = statusConfig[report.status as keyof typeof statusConfig] || statusConfig.pending;
                                    return (
                                        <Link 
                                            key={report.id} 
                                            to={`/reports/${report.id}`}
                                            onClick={() => handleReportClick(report.id)}
                                            className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                                        <FileText className="h-5 w-5 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white truncate max-w-[200px] md:max-w-md">
                                                            {report.title}
                                                        </p>
                                                        <div className="flex items-center text-xs text-slate-500 space-x-2">
                                                            <MapPin size={12} />
                                                            <span>{report.facility?.name || 'Unknown'}</span>
                                                            <span>•</span>
                                                            <span>{new Date(report.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge variant={status.variant}>
                                                    {t(status.label)}
                                                </Badge>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;


