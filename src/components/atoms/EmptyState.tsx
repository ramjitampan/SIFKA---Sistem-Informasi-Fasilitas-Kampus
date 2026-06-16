import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                <Icon size={24} />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            <p className="max-w-xs mb-6 text-sm text-slate-500 dark:text-slate-400">{description}</p>
            {action && <div>{action}</div>}
        </div>
    );
};

export default EmptyState;
