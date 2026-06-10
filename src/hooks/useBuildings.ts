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

export const useBuildings = () => {
    return useQuery({
        queryKey: ['buildings'],
        queryFn: async () => {
            const { data } = await api.get('/buildings');
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
