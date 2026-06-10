import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import Card, { CardContent } from '../../components/atoms/Card';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../../components/molecules/ThemeToggle';
import LanguageSwitcher from '../../components/molecules/LanguageSwitcher';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const { login, isLoggingIn } = useAuth();
    const { t } = useTranslation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login({ email, password, remember });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 relative">
            <div className="absolute top-4 right-4 flex items-center space-x-2">
                <LanguageSwitcher />
                <ThemeToggle />
            </div>
            <Card className="max-w-md w-full p-4">
                <CardContent className="space-y-8">
                    <div>
                        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {t('auth.login_title')}
                        </h2>
                        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                            {t('auth.login_subtitle')}
                        </p>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <Input
                                label={t('auth.email')}
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('auth.email')}
                            />
                            <Input
                                label={t('auth.password')}
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('auth.password')}
                            />
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-slate-900 dark:text-slate-100">
                                    {t('auth.remember_me')}
                                </label>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            isLoading={isLoggingIn}
                            className="w-full"
                        >
                            {isLoggingIn ? t('auth.signing_in') : t('auth.sign_in')}
                        </Button>

                        <div className="text-center">
                            <Link
                                to="/register"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                            >
                                {t('auth.no_account')}
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;

