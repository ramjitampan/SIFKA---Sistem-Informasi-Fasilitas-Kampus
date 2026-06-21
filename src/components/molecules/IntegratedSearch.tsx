import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, MapPin, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalSearch } from '../../hooks/useGlobalSearch';
import { useTranslation } from 'react-i18next';

interface IntegratedSearchProps {
    onActiveChange?: (active: boolean) => void;
}

const IntegratedSearch: React.FC<IntegratedSearchProps> = ({ onActiveChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const { data: results, isLoading } = useGlobalSearch(debouncedQuery);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedQuery(inputValue), 300);
        return () => clearTimeout(handler);
    }, [inputValue]);

    useEffect(() => {
        onActiveChange?.(isExpanded);
    }, [isExpanded, onActiveChange]);

    const handleSelect = (href: string, query?: string) => {
        setIsExpanded(false);
        setInputValue('');
        const url = query ? `${href}?q=${encodeURIComponent(query)}` : href;
        navigate(url);
    };

    const hasResults = results && (results.buildings.length > 0 || results.facilities.length > 0 || results.reports.length > 0);

    return (
        <div 
            ref={containerRef} 
            className={`flex items-center ${isExpanded ? 'flex-1' : ''}`}
            onBlur={(e) => {
                if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
                    setIsExpanded(false);
                    setInputValue('');
                }
            }}
        >
            {!isExpanded ? (
                <button onClick={() => setIsExpanded(true)} className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                    <Search size={20} />
                </button>
            ) : (
                <motion.div 
                    layout
                    initial={{ width: '40px' }} 
                    animate={{ width: '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="flex flex-col w-full relative"
                >
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg px-3 bg-white dark:bg-slate-800 shadow-sm">
                        <Search className="h-4 w-4 text-slate-400 shrink-0" />
                        <input
                            autoFocus
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={t('map.search_placeholder')}
                            className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 outline-none focus:outline-none text-sm h-10 px-3"
                        />
                        <button onClick={() => { setIsExpanded(false); setInputValue(''); }} className="text-slate-400 hover:text-slate-600">
                            <X size={18} />
                        </button>
                    </div>

                    <AnimatePresence>
                        {debouncedQuery.length >= 2 && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: 'auto' }} 
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 z-[100] overflow-hidden"
                            >
                                <div className="max-h-[60vh] overflow-y-auto p-2">
                                    {!hasResults && !isLoading && <div className="p-4 text-center text-sm text-slate-500">{t('common.no_data')}</div>}
                                    {hasResults && (
                                        <div className="p-2 space-y-4">
                                            {results.buildings.length > 0 && (
                                                <div>
                                                    <h5 className="px-2 text-[10px] font-bold uppercase text-slate-400">{t('nav.buildings')}</h5>
                                                    {results.buildings.map(b => (
                                                        <button key={b.id} onClick={() => handleSelect(`/buildings/${b.id}`)} className="flex items-center w-full px-2 py-1.5 text-sm rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
                                                            <Building2 size={14} className="mr-2" /> {b.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            {results.facilities.length > 0 && (
                                                <div>
                                                    <h5 className="px-2 text-[10px] font-bold uppercase text-slate-400">{t('nav.facilities')}</h5>
                                                    {results.facilities.map(f => (
                                                        <button key={f.id} onClick={() => handleSelect(`/facilities/${f.id}`)} className="flex items-center w-full px-2 py-1.5 text-sm rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
                                                            <MapPin size={14} className="mr-2" /> {f.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            {results.reports.length > 0 && (
                                                <div>
                                                    <h5 className="px-2 text-[10px] font-bold uppercase text-slate-400">{t('nav.reports')}</h5>
                                                    {results.reports.map(r => (
                                                        <button key={r.id} onClick={() => handleSelect(`/reports/${r.id}`)} className="flex items-center w-full px-2 py-1.5 text-sm rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
                                                            <FileText size={14} className="mr-2" /> {r.title}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="border-t border-slate-100 dark:border-slate-700 p-2">
                                        <button onClick={() => handleSelect('/advanced-search', debouncedQuery)} className="w-full text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">{t('advanced_search.title')}</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default IntegratedSearch;