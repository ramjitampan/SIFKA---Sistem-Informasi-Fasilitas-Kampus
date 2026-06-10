import React, { useState } from 'react';
import { User } from '../../hooks/useUsers';
import { useTranslation } from 'react-i18next';
import Input from '../atoms/Input';

interface UserFormProps {
    initialData?: User;
    onSubmit: (data: any) => void;
    isLoading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit, isLoading }) => {
    const { t } = useTranslation();
    const [name, setName] = useState(initialData?.name || '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [role, setRole] = useState(initialData?.role || 'student');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: any = { name, email, role };
        if (password) data.password = password;
        onSubmit(data);
    };

    return (
        <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
            <Input
                label={t('auth.full_name')}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Jane Doe"
            />
            <Input
                label={t('auth.email')}
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
            />
            
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {t('users.role')}
                </label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <Input
                label={t('auth.password')}
                required={!initialData}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={initialData ? "Leave blank to keep current" : "Min. 8 characters"}
            />
        </form>
    );
};

export default UserForm;
