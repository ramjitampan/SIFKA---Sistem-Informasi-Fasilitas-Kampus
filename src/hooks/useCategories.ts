import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

export interface Category {
    id: number;
    name: string;
    icon_marker: string;
    color_code: string;
    facilities_count?: number;
}

export interface CategoriesResponse {
    data: Category[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface CategoryFilters {
    page?: number;
    search?: string;
}

export const useCategories = (filters: CategoryFilters = {}) => {
    return useQuery({
        queryKey: ['categories', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.search) params.append('q', filters.search);
            
            const { data } = await api.get(`/categories?${params.toString()}`);
            return data as CategoriesResponse;
        },
    });
};

export const useAllCategories = () => {
    return useQuery({
        queryKey: ['categories', 'all'],
        queryFn: async () => {
            const { data } = await api.get('/categories/search');
            return data.data as Category[];
        },
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (categoryData: Omit<Category, 'id'>) => {
            const { data } = await api.post('/categories', categoryData);
            return data.data as Category;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...categoryData }: { id: number } & Partial<Category>) => {
            const { data } = await api.put(`/categories/${id}`, categoryData);
            return data.data as Category;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/categories/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};
