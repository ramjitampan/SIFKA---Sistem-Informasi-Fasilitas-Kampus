import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import { Coordinate } from './useBuildings';

export interface Category {
    id: number;
    name: string;
    icon_marker?: string;
    color_code?: string;
}

export interface Facility {
    id: number;
    name: string;
    description: string;
    coordinate: Coordinate;
    building_id: number;
    category?: Category;
}

export const useFacilities = () => {
    return useQuery({
        queryKey: ['facilities'],
        queryFn: async () => {
            const { data } = await api.get('/facilities');
            return data.data as Facility[];
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
