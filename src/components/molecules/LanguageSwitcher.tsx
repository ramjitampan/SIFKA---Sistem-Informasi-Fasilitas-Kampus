import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'en' ? 'id' : 'en';
        i18n.changeLanguage(nextLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50 rounded-lg transition-colors flex items-center space-x-2"
            title={i18n.language === 'en' ? 'Switch to Indonesian' : 'Switch to English'}
        >
            <Languages size={20} />
            <span className="text-xs font-bold uppercase">{i18n.language}</span>
        </button>
    );
};

export default LanguageSwitcher;
