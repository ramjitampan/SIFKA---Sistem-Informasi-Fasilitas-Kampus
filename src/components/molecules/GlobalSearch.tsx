import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, Building2, MapPin, FileText, Loader2, X } from 'lucide-react';
import { useGlobalSearch } from '../../hooks/useGlobalSearch';
import { useTranslation } from 'react-i18next';
import Badge from '../atoms/Badge';

const GlobalSearch: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const { data: results, isLoading } = useGlobalSearch(query);
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Command menu shortcut (Cmd/Ctrl + K)
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const handleSelect = (href: string) => {
        setIsOpen(false);
        setQuery('');
        navigate(href);
    };

    const hasResults = !!results && (
        (results.buildings?.length ?? 0) > 0 || 
        (results.facilities?.length ?? 0) > 0 || 
        (results.reports?.length ?? 0) > 0
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                title={`${t('common.search')} (⌘K)`}
            >
                <Search size={20} />
            </button>

            <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm" />
                    <Dialog.Content className="fixed left-[50%] top-[20%] z-50 w-full max-w-2xl translate-x-[-50%] bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden focus:outline-none">
                        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                            <Search className="h-5 w-5 text-slate-400 mr-3" />
                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={t('map.search_placeholder')}
                                className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 sm:text-sm h-8"
                            />
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />}
                            <Dialog.Close className="ml-3 text-slate-400 hover:text-slate-500">
                                <X size={18} />
                            </Dialog.Close>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-2">
                            {query.length < 2 ? (
                                <div className="p-8 text-center text-slate-500 text-sm">
                                    {t('map.search_placeholder')}
                                </div>
                            ) : !hasResults && !isLoading ? (
                                <div className="p-8 text-center text-slate-500 text-sm">
                                    {t('common.no_data')}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {(results?.buildings?.length ?? 0) > 0 && (
                                        <div>
                                            <h4 className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                {t('nav.buildings')}
                                            </h4>
                                            {results?.buildings.map((building) => (
                                                <button
                                                    key={building.id}
                                                    onClick={() => handleSelect(`/buildings`)}
                                                    className="w-full flex items-center px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group"
                                                >
                                                    <Building2 className="h-4 w-4 text-slate-400 mr-3 group-hover:text-indigo-500" />
                                                    <div className="text-left">
                                                        <p className="font-medium text-slate-900 dark:text-white">{building.name}</p>
                                                        <p className="text-xs text-slate-500 truncate max-w-[400px]">{building.description}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {(results?.facilities?.length ?? 0) > 0 && (
                                        <div>
                                            <h4 className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                Fasilitas
                                            </h4>
                                            {results?.facilities.map((facility) => (
                                                <button
                                                    key={facility.id}
                                                    onClick={() => handleSelect(`/map`)}
                                                    className="w-full flex items-center px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group"
                                                >
                                                    <MapPin className="h-4 w-4 text-slate-400 mr-3 group-hover:text-red-500" />
                                                    <div className="text-left">
                                                        <p className="font-medium text-slate-900 dark:text-white">{facility.name}</p>
                                                        <p className="text-xs text-slate-500">{facility.building?.name}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {(results?.reports?.length ?? 0) > 0 && (
                                        <div>
                                            <h4 className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                {t('nav.reports')}
                                            </h4>
                                            {results?.reports.map((report) => (
                                                <button
                                                    key={report.id}
                                                    onClick={() => handleSelect(`/reports/${report.id}`)}
                                                    className="w-full flex items-center px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group"
                                                >
                                                    <FileText className="h-4 w-4 text-slate-400 mr-3 group-hover:text-indigo-500" />
                                                    <div className="text-left flex-1">
                                                        <p className="font-medium text-slate-900 dark:text-white">{report.title}</p>
                                                        <p className="text-xs text-slate-500 truncate max-w-[400px]">{report.description}</p>
                                                    </div>
                                                    <Badge variant="default" className="text-[10px] scale-90">
                                                        {report.status}
                                                    </Badge>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
};

export default GlobalSearch;
