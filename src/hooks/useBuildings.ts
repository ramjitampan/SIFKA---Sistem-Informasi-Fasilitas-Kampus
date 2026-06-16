import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

export interface Coordinate {
    lat: number;
    lng: number;
}

export interface Building {
    id: number;
    name: string;
    description: string;
    coordinate: Coordinate;
}

export interface BuildingsResponse {
    data: Building[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface BuildingFilters {
    page?: number;
    q?: string;
}

export const useBuilding = (id: string | number | undefined) => {
    return useQuery({
        queryKey: ['buildings', id],
        queryFn: async () => {
            if (!id) throw new Error('Building ID is required');
            const { data } = await api.get(`/buildings/${id}`);
            return data.data as Building;
        },
        enabled: !!id,
    });
};

export const useBuildings = (filters: BuildingFilters = {}) => {
    return useQuery({
        queryKey: ['buildings', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.q) params.append('q', filters.q);
            
            const { data } = await api.get(`/buildings?${params.toString()}`);
            return data as BuildingsResponse;
        },
    });
};

export const useAllBuildings = () => {
    return useQuery({
        queryKey: ['buildings', 'all'],
        queryFn: async () => {
            const { data } = await api.get('/buildings/search');
            return data.data as Building[];
        },
    });
};

export const useSearchBuildings = (query: string) => {
    return useQuery({
        queryKey: ['buildings', 'search', query],
        queryFn: async () => {
            if (!query) return [];
            const { data } = await api.get(`/buildings/search?q=${query}`);
            return data.data as Building[];
        },
        enabled: query.length > 2,
    });
};

export const useCreateBuilding = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (building: Omit<Building, 'id'>) => {
            const { data } = await api.post('/buildings', {
                name: building.name,
                description: building.description,
                latitude: building.coordinate.lat,
                longitude: building.coordinate.lng,
            });
            return data.data as Building;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['buildings'] });
        },
    });
};

export const useUpdateBuilding = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (building: Building) => {
            const { data } = await api.put(`/buildings/${building.id}`, {
                name: building.name,
                description: building.description,
                latitude: building.coordinate.lat,
                longitude: building.coordinate.lng,
            });
            return data.data as Building;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['buildings'] });
        },
    });
};

export const useDeleteBuilding = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/buildings/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['buildings'] });
        },
    });
};
