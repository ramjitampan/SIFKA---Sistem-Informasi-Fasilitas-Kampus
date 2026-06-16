import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, Building2, MapPin, FileText, Loader2, X } from 'lucide-react';
import { useGlobalSearch } from '../../hooks/useGlobalSearch';
import { useTranslation } from 'react-i18next';

const GlobalSearch: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const { data: results, isLoading } = useGlobalSearch(query);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleSelect = (href: string) => {
        setIsOpen(false);
        setQuery('');
        navigate(href);
    };

    const hasResults = results && (results.buildings.length > 0 || results.facilities.length > 0 || results.reports.length > 0);

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
                    <Dialog.Content className="fixed inset-x-2 sm:inset-x-auto top-[5%] sm:top-[20%] z-50 w-full sm:max-w-xl sm:translate-x-[-50%] bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden focus:outline-none">
                        <div className="flex items-center px-3 py-2 border-b border-slate-200 dark:border-slate-700">
                            <Search className="h-5 w-5 text-slate-400 mr-2 shrink-0" />
                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={t('map.search_placeholder')}
                                className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 text-sm h-8"
                            />
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-indigo-600 shrink-0" />}
                            <Dialog.Close className="ml-2 text-slate-400 hover:text-slate-500">
                                <X size={18} />
                            </Dialog.Close>
                        </div>

                        <div className="max-h-[50vh] overflow-y-auto p-2">
                            {query.length >= 2 && !hasResults && !isLoading && (
                                <div className="p-8 text-center text-slate-500 text-sm">{t('common.no_data')}</div>
                            )}

                            {hasResults && (
                                <div className="space-y-1">
                                    {results?.buildings.slice(0, 3).map((b) => (
                                        <button key={b.id} onClick={() => handleSelect(`/buildings/${b.id}`)} className="w-full flex items-center px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-left">
                                            <Building2 className="h-4 w-4 text-slate-400 mr-3" />
                                            <span className="font-medium text-slate-900 dark:text-white">{b.name}</span>
                                        </button>
                                    ))}
                                    {results?.facilities.slice(0, 3).map((f) => (
                                        <button key={f.id} onClick={() => handleSelect(`/facilities/${f.id}`)} className="w-full flex items-center px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-left">
                                            <MapPin className="h-4 w-4 text-slate-400 mr-3" />
                                            <span className="font-medium text-slate-900 dark:text-white">{f.name}</span>
                                        </button>
                                    ))}
                                    {results?.reports.slice(0, 3).map((r) => (
                                        <button key={r.id} onClick={() => handleSelect(`/reports/${r.id}`)} className="w-full flex items-center px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-left">
                                            <FileText className="h-4 w-4 text-slate-400 mr-3" />
                                            <span className="font-medium text-slate-900 dark:text-white">{r.title}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                            <button onClick={() => handleSelect('/advanced-search')} className="w-full text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 transition-colors text-center px-2">
                                {t('advanced_search.title')}
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
};

export default GlobalSearch;
