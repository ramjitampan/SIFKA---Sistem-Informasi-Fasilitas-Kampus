import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

interface GlobalErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

const GlobalErrorFallback: React.FC<GlobalErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 dark:bg-slate-900">
            <div className="w-full max-w-md p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                    <AlertCircle size={32} />
                </div>
                <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Something went wrong</h1>
                <p className="mb-6 text-slate-600 dark:text-slate-400">
                    An unexpected error occurred. We've been notified and are looking into it.
                </p>
                
                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-6 p-4 text-left bg-slate-100 dark:bg-slate-900 rounded-lg overflow-auto max-h-40">
                        <p className="text-xs font-mono text-red-600 dark:text-red-400 whitespace-pre-wrap">
                            {error.message}
                        </p>
                    </div>
                )}

                <Button 
                    onClick={resetErrorBoundary}
                    className="w-full"
                >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
            </div>
        </div>
    );
};

export default GlobalErrorFallback;
