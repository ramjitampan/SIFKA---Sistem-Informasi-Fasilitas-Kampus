import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { Coordinate } from './useBuildings';
import { Category } from './useCategories';

export interface Facility {
    id: number;
    name: string;
    description: string;
    coordinate: Coordinate;
    building_id: number | null;
    category_id: number;
    category?: Category;
    building?: {
        id: number;
        name: string;
    };
}

export interface FacilitiesResponse {
    data: Facility[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface FacilityFilters {
    page?: number;
    search?: string;
    category_id?: number;
    building_id?: number;
}

export const useFacilities = (filters: FacilityFilters = {}) => {
    return useQuery({
        queryKey: ['facilities', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.search) params.append('q', filters.search);
            if (filters.category_id) params.append('category_id', filters.category_id.toString());
            if (filters.building_id) params.append('building_id', filters.building_id.toString());
            
            const { data } = await api.get(`/facilities?${params.toString()}`);
            return data as FacilitiesResponse;
        },
    });
};

export const useSearchFacilities = (query: string) => {
    return useQuery({
        queryKey: ['facilities', 'search', query],
        queryFn: async () => {
            if (!query) return [];
            const { data } = await api.get(`/facilities/search?q=${query}`);
            return data.data as Facility[];
        },
        enabled: query.length > 2,
    });
};

export const useCreateFacility = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (facilityData: any) => {
            const { data } = await api.post('/facilities', facilityData);
            return data.data as Facility;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['facilities'] });
        },
    });
};

export const useUpdateFacility = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...facilityData }: { id: number; [key: string]: any }) => {
            const { data } = await api.put(`/facilities/${id}`, facilityData);
            return data.data as Facility;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['facilities'] });
        },
    });
};

export const useDeleteFacility = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/facilities/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['facilities'] });
        },
    });
};
