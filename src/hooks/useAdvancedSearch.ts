import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export const useAdvancedSearch = (params: URLSearchParams) => {
    return useQuery({
        queryKey: ['advanced-search', params.toString()],
        queryFn: async () => {
            const { data } = await api.get(`/search/advanced?${params.toString()}`);
            return data;
        },
        enabled: params.toString().length > 0,
    });
};
