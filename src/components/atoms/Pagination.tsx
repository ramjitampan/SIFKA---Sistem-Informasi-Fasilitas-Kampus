import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const { t } = useTranslation('common');
    const [goToPage, setGoToPage] = useState('');

    const handleGoTo = (e: React.FormEvent) => {
        e.preventDefault();
        const page = parseInt(goToPage);
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
            setGoToPage('');
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }
        return pages;
    };

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 py-4">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
            >
                <ChevronLeft size={16} />
            </Button>
            
            {getPageNumbers().map((page, index) => (
                <Button
                    key={index}
                    variant={page === currentPage ? 'primary' : 'ghost'}
                    size="sm"
                    className={`h-8 w-8 p-0 rounded-full ${page === currentPage ? 'shadow-md' : ''}`}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    disabled={page === '...'}
                >
                    {page}
                </Button>
            ))}

            <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
            >
                <ChevronRight size={16} />
            </Button>

            <form onSubmit={handleGoTo} className="flex items-center gap-2 ml-4 text-sm text-indigo-600 dark:text-indigo-400">
                <span>{t('pagination.go_to')}</span>
                <Input
                    type="number"
                    value={goToPage}
                    onChange={(e) => setGoToPage(e.target.value)}
                    className="w-12 h-8 text-center bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800"
                    min="1"
                    max={totalPages}
                />
                <span>{t('pagination.page')}</span>
            </form>
        </div>
    );
};

export default Pagination;
