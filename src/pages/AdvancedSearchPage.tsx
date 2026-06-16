import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Card, { CardContent } from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import { Search, SlidersHorizontal, FileText, PackageOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAdvancedSearch } from '../hooks/useAdvancedSearch';
import QueryStateHandler from '../components/atoms/QueryStateHandler';

const AdvancedSearchPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { t } = useTranslation();
    const { data, isLoading, isError, error } = useAdvancedSearch(searchParams);

    const updateFilter = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('advanced_search.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t('advanced_search.subtitle')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-1 h-fit">
                    <CardContent className="p-4 space-y-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center">
                            <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
                        </h3>
                        <div>
                            <label className="block text-sm text-slate-600 mb-1">Search Term</label>
                            <Input
                                value={searchParams.get('q') || ''}
                                onChange={(e) => updateFilter('q', e.target.value)}
                                placeholder="Search everything..."
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-600 mb-1">Status</label>
                            <select
                                className="w-full border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm"
                                value={searchParams.get('status') || ''}
                                onChange={(e) => updateFilter('status', e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                <option value="open">Open</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                    <CardContent className="p-6">
                        <QueryStateHandler
                            isLoading={isLoading}
                            isError={isError}
                            error={error}
                            data={data}
                            emptyState={{
                                icon: PackageOpen,
                                title: 'No results found',
                                description: 'Try adjusting your filters or search term.'
                            }}
                        >
                            {(results) => (
                                <div className="space-y-4">
                                    {results.map((item: any) => (
                                        <div key={item.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center">
                                            <FileText className="mr-4 text-slate-400" />
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">{item.title || item.name}</p>
                                                <p className="text-sm text-slate-500">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </QueryStateHandler>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdvancedSearchPage;
