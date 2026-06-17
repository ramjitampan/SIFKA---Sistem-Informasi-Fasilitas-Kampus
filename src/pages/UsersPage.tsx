import React, { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, User, UserFilters } from '../hooks/useUsers';
import { 
    Users, 
    Trash2, 
    Mail, 
    Calendar, 
    Plus, 
    Edit, 
    ChevronLeft, 
    ChevronRight,
    ArrowUpDown,
    Search,
    PackageOpen
} from 'lucide-react';
import Button from '../components/atoms/Button';
import Card, { CardContent } from '../components/atoms/Card';
import Badge from '../components/atoms/Badge';
import Input from '../components/atoms/Input';
import Modal from '../components/atoms/Modal';
import UserForm from '../components/molecules/UserForm';
import QueryStateHandler from '../components/atoms/QueryStateHandler';
import Pagination from '../components/atoms/Pagination';
import DeleteConfirmationModal from '../components/atoms/DeleteConfirmationModal';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const UsersPage: React.FC = () => {
    const { t } = useTranslation();
    const [filters, setFilters] = useState<UserFilters>({
        page: 1,
        sort_by: 'created_at',
        sort_order: 'desc'
    });

    const { data: usersData, isLoading, isError, error } = useUsers(filters);
    const { mutateAsync: createUser, isPending: isCreating } = useCreateUser();
    const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
    const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUser();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);

    const handleSort = (field: 'name' | 'created_at' | 'role') => {
        setFilters(prev => ({
            ...prev,
            sort_by: field,
            sort_order: prev.sort_by === field && prev.sort_order === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    };

    const handleAddClick = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (userToDelete) {
            toast.promise(deleteUser(userToDelete), {
                loading: 'Deleting user...',
                success: 'User deleted successfully',
                error: (err) => err?.response?.data?.message || 'Failed to delete user',
            });
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };

    const handleFormSubmit = async (data: any) => {
        const promise = editingUser 
            ? updateUser({ id: editingUser.id, ...data })
            : createUser(data);

        toast.promise(promise, {
            loading: editingUser ? 'Updating user...' : 'Creating user...',
            success: editingUser ? 'User updated successfully' : 'User created successfully',
            error: (err) => err?.response?.data?.message || `Failed to ${editingUser ? 'update' : 'create'} user`,
        });

        try {
            await promise;
            setIsModalOpen(false);
        } catch (error) {
            // Error handled by toast.promise
        }
    };

    const getRoleVariant = (role: string) => {
        switch (role) {
            case 'admin': return 'error';
            case 'staff': return 'info';
            default: return 'default';
        }
    };

    return (
        <div className="space-y-6">
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title={t('users.delete_title')}
                description={t('users.delete_desc')}
                isDeleting={isDeleting}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('users.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t('users.subtitle')}</p>
                </div>
                <Button onClick={handleAddClick}>
                    <Plus className="mr-2 h-5 w-5" />
                    Add User
                </Button>
            </div>

            <Card>
                <CardContent className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <form onSubmit={handleSearch} className="relative w-full max-w-sm">
                        <Input
                            placeholder={t('common.search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    </form>

                    <div className="flex items-center space-x-2 w-full md:w-auto">
                        <select
                            value={filters.role || ''}
                            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value || undefined, page: 1 }))}
                            className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Roles</option>
                            <option value="student">Student</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </CardContent>

                <QueryStateHandler
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    data={usersData?.data}
                    emptyState={{
                        icon: PackageOpen,
                        title: 'No users found',
                        description: 'Try adjusting your search or add a new user.',
                        action: (
                            <Button variant="outline" size="sm" onClick={handleAddClick}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                        )
                    }}
                >
                    {(users) => (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                                            <th 
                                                className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors"
                                                onClick={() => handleSort('name')}
                                            >
                                                <div className="flex items-center">
                                                    {t('users.user')}
                                                    <ArrowUpDown size={12} className="ml-1" />
                                                </div>
                                            </th>
                                            <th 
                                                className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors"
                                                onClick={() => handleSort('role')}
                                            >
                                                <div className="flex items-center">
                                                    {t('users.role')}
                                                    <ArrowUpDown size={12} className="ml-1" />
                                                </div>
                                            </th>
                                            <th 
                                                className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors"
                                                onClick={() => handleSort('created_at')}
                                            >
                                                <div className="flex items-center">
                                                    {t('users.joined')}
                                                    <ArrowUpDown size={12} className="ml-1" />
                                                </div>
                                            </th>
                                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">{t('users.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                                                            <div className="flex items-center text-xs text-slate-500">
                                                                <Mail size={12} className="mr-1" />
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant={getRoleVariant(user.role)} className="capitalize">
                                                        {user.role}
                                                    </Badge>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center text-xs text-slate-500">
                                                        <Calendar size={12} className="mr-1" />
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right space-x-2">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => handleEditClick(user)}
                                                    >
                                                        <Edit size={14} />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => {
                                                            setUserToDelete(user.id);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        disabled={isDeleting}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {usersData && usersData.meta.last_page > 1 && (
                                <Pagination
                                    currentPage={usersData.meta.current_page}
                                    totalPages={usersData.meta.last_page}
                                    onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
                                />
                            )}
                        </>
                    )}
                </QueryStateHandler>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? 'Edit User' : 'Add New User'}
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button 
                            type="submit" 
                            form="user-form" 
                            isLoading={isCreating || isUpdating}
                        >
                            {t('common.save')}
                        </Button>
                    </>
                }
            >
                <UserForm 
                    initialData={editingUser || undefined} 
                    onSubmit={handleFormSubmit} 
                    isLoading={isCreating || isUpdating}
                />
            </Modal>
        </div>
    );
};
export default UsersPage;
