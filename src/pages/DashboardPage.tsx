import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useReports } from '../hooks/useReports';
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
    const { data: reportsData, isLoading } = useReports(1);
    const { t } = useTranslation();

    const stats = [
        {
            label: t('dashboard.stats.total_reports'),
            value: reportsData?.meta.total || 0,
            icon: FileText,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20'
        },
        {
            label: t('dashboard.stats.pending'),
            value: reportsData?.status_counts.pending || 0,
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-50 dark:bg-amber-900/20'
        },
        {
            label: t('dashboard.stats.in_progress'),
            value: reportsData?.status_counts.in_progress || 0,
            icon: Loader2,
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            label: t('dashboard.stats.resolved'),
            value: reportsData?.status_counts.resolved || 0,
            icon: CheckCircle2,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20'
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {t('dashboard.welcome', { name: user?.name })}
                </h1>
                <p className="text-slate-500 dark:text-slate-400">{t('dashboard.subtitle')}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="flex items-center p-6">
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} mr-4`}>
                                <stat.icon size={24} className={stat.label === t('dashboard.stats.in_progress') ? 'animate-spin' : ''} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {isLoading ? '...' : stat.value}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Reports */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                            <TrendingUp className="mr-2 h-5 w-5 text-indigo-500" />
                            {t('dashboard.recent_reports')}
                        </h2>
                        <Link to="/reports" className="text-sm text-indigo-600 hover:underline">{t('dashboard.view_all')}</Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-8 flex justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                            </div>
                        ) : reportsData?.data.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">{t('common.no_data')}</div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                {reportsData?.data.slice(0, 5).map((report) => {
                                    const status = statusConfig[report.status as keyof typeof statusConfig] || statusConfig.pending;
                                    return (
                                        <Link
                                            key={report.id}
                                            to={`/reports/${report.id}`}
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

                {/* Role Info / Quick Actions */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('dashboard.account_details')}</h2>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 text-xl font-bold">
                                    {user?.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">{user?.name}</p>
                                    <Badge variant="default" className="capitalize">{user?.role}</Badge>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                                <p className="text-sm text-slate-500 mb-2">{t('auth.email')}</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('dashboard.quick_actions')}</h2>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link to="/reports/create" className="block">
                                <button className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                    {t('dashboard.submit_new')}
                                </button>
                            </Link>
                            <Link to="/map" className="block">
                                <button className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                    {t('dashboard.view_map')}
                                </button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;


