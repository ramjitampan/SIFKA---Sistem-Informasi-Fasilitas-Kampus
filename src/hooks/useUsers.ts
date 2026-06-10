import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'staff' | 'admin';
    created_at: string;
}

export interface UsersResponse {
    data: User[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface UserFilters {
    page?: number;
    sort_by?: 'name' | 'created_at' | 'role';
    sort_order?: 'asc' | 'desc';
    role?: string;
    search?: string;
}

export const useUsers = (filters: UserFilters = {}) => {
    return useQuery({
        queryKey: ['users', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.sort_by) params.append('sort_by', filters.sort_by);
            if (filters.sort_order) params.append('sort_order', filters.sort_order);
            if (filters.role) params.append('role', filters.role);
            if (filters.search) params.append('q', filters.search);
            params.append('per_page', '10');
            
            const { data } = await api.get(`/users?${params.toString()}`);
            return data as UsersResponse;
        },
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userData: any) => {
            const { data } = await api.post('/users', userData);
            return data.data as User;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...userData }: { id: number; [key: string]: any }) => {
            const { data } = await api.put(`/users/${id}`, userData);
            return data.data as User;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export const useUpdateUserRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, role }: { id: number; role: string }) => {
            const { data } = await api.put(`/users/${id}/role`, { role });
            return data.data as User;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/users/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};
