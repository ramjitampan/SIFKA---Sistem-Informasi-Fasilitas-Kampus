import React from 'react';
import { Loader2, AlertCircle, PackageOpen } from 'lucide-react';
import EmptyState from './EmptyState';
import Button from './Button';

interface QueryStateHandlerProps<T> {
    isLoading: boolean;
    isError: boolean;
    error?: any;
    data?: T | null;
    children: React.ReactNode | ((data: T) => React.ReactNode);
    emptyState?: {
        icon?: any;
        title?: string;
        description?: string;
        action?: React.ReactNode;
    };
    loadingComponent?: React.ReactNode;
}

const QueryStateHandler = <T,>({
    isLoading,
    isError,
    error,
    data,
    children,
    emptyState,
    loadingComponent,
}: QueryStateHandlerProps<T>) => {
    if (isLoading) {
        return loadingComponent || (
            <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading data...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                    <AlertCircle size={24} />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">Failed to load data</h3>
                <p className="max-w-xs mb-6 text-sm text-slate-500 dark:text-slate-400">
                    {error?.response?.data?.message || error?.message || 'An error occurred while fetching data.'}
                </p>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    Retry
                </Button>
            </div>
        );
    }

    const isEmpty = !data || (Array.isArray(data) && data.length === 0);

    if (isEmpty) {
        return (
            <EmptyState
                icon={emptyState?.icon || PackageOpen}
                title={emptyState?.title || 'No data found'}
                description={emptyState?.description || 'There is no information available at this time.'}
                action={emptyState?.action}
            />
        );
    }

    return typeof children === 'function' ? (children as (data: T) => React.ReactNode)(data as T) : <>{children}</>;
};

export default QueryStateHandler;
