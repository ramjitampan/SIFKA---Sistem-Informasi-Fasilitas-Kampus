import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Map as MapIcon, 
    FileText, 
    Users, 
    Menu, 
    X, 
    LogOut,
    Building2,
    Languages,
    MapPin,
    Tag
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import GlobalSearch from '../molecules/GlobalSearch';
import ThemeToggle from '../molecules/ThemeToggle';
import LanguageSwitcher from '../molecules/LanguageSwitcher';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        const savedState = localStorage.getItem('sidebarOpen');
        return savedState !== null ? JSON.parse(savedState) : false;
    });
    const { user } = useAuthStore();
    const { logout } = useAuth();
    const { t } = useTranslation();
    const location = useLocation();

    const toggleSidebar = () => {
        const newState = !isSidebarOpen;
        setIsSidebarOpen(newState);
        localStorage.setItem('sidebarOpen', JSON.stringify(newState));
    };

    const navigation = [
        { name: t('nav.dashboard'), href: '/', icon: LayoutDashboard, roles: ['student', 'staff', 'admin'] },
        { name: t('nav.map'), href: '/map', icon: MapIcon, roles: ['student', 'staff', 'admin'] },
        { name: t('nav.reports'), href: '/reports', icon: FileText, roles: ['student', 'staff', 'admin'] },
        { name: t('nav.buildings'), href: '/buildings', icon: Building2, roles: ['staff', 'admin'] },
        { name: t('nav.facilities'), href: '/facilities', icon: MapPin, roles: ['staff', 'admin'] },
        { name: t('nav.categories'), href: '/categories', icon: Tag, roles: ['admin'] },
        { name: t('nav.users'), href: '/users', icon: Users, roles: ['admin'] },
    ];

    const filteredNavigation = navigation.filter(item => 
        item.roles.includes(user?.role || 'student')
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-50 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}
            
            {/* Sidebar */}
            <aside 
                className={`fixed inset-y-0 left-0 z-[60] w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}
            >
                <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">SIFKA</span>
                        <button onClick={toggleSidebar} className="lg:hidden text-slate-500">
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {filteredNavigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) => `
                                    flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors
                                    ${isActive 
                                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' 
                                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'}
                                `}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                        <div className="flex items-center px-2">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">
                                {user?.name.charAt(0)}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[120px]">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                    {user?.role}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => logout()}
                            className="flex w-full items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            {t('common.sign_out')}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8">
                    <button 
                        onClick={toggleSidebar} 
                        className={`text-slate-500 lg:hidden ${isSidebarOpen ? 'hidden' : 'block'}`}
                    >
                        <Menu size={24} />
                    </button>
                    
                    <div className="flex-1" />

                    <div className="flex items-center space-x-2 md:space-x-4">
                        <GlobalSearch />
                        
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
                        
                        <LanguageSwitcher />

                        <ThemeToggle />
                    </div>
                </header>

                <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
