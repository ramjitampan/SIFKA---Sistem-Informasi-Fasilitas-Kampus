import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import Card, { CardContent } from '../../components/atoms/Card';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../../components/molecules/ThemeToggle';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const { register, isRegistering } = useAuth();
    const { t } = useTranslation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        register({ 
            name, 
            email, 
            password, 
            password_confirmation: passwordConfirmation 
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 relative">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <Card className="max-w-md w-full p-4">
                <CardContent className="space-y-8">
                    <div>
                        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {t('auth.register_title')}
                        </h2>
                        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                            {t('auth.register_subtitle')}
                        </p>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <Input
                                label={t('auth.full_name')}
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                            />
                            <Input
                                label={t('auth.email')}
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@example.com"
                            />
                            <Input
                                label={t('auth.password')}
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 8 characters"
                            />
                            <Input
                                label={t('auth.confirm_password')}
                                type="password"
                                required
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                placeholder="Repeat password"
                            />
                        </div>

                        <Button
                            type="submit"
                            isLoading={isRegistering}
                            className="w-full"
                        >
                            {isRegistering ? t('auth.registering') : t('auth.register')}
                        </Button>

                        <div className="text-center">
                            <Link
                                to="/login"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                            >
                                {t('auth.have_account')}
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default RegisterPage;

