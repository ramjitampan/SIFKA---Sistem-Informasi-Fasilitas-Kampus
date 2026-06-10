import React, { useEffect } from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
    const { theme, setTheme } = useThemeStore();

    useEffect(() => {
        const root = window.document.documentElement;
        
        const applyTheme = (currentTheme: 'light' | 'dark' | 'system') => {
            root.classList.remove('light', 'dark');
            
            let effectiveTheme: 'light' | 'dark' = 'light';
            if (currentTheme === 'system') {
                effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            } else {
                effectiveTheme = currentTheme;
            }
            
            root.classList.add(effectiveTheme);
            // In Tailwind 4, setting color-scheme helps with native elements
            root.style.colorScheme = effectiveTheme;
            
            console.log(`Theme applied: ${currentTheme} (effective: ${effectiveTheme})`);
        };

        applyTheme(theme);

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme('system');
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    const toggleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300 flex items-center justify-center space-x-2"
            title={`Current theme: ${theme}. Click to switch.`}
        >
            {theme === 'light' && <Sun size={20} />}
            {theme === 'dark' && <Moon size={20} />}
            {theme === 'system' && (
                <div className="relative">
                    <Sun size={20} className="opacity-50" />
                    <Moon size={12} className="absolute -bottom-1 -right-1" />
                </div>
            )}
            <span className="text-xs font-medium capitalize hidden sm:inline-block w-12 text-left">
                {theme}
            </span>
        </button>
    );
};

export default ThemeToggle;
