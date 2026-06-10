import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import { Building } from './useBuildings';
import { Facility } from './useFacilities';
import { Report } from './useReports';

export interface SearchResults {
    buildings: Building[];
    facilities: Facility[];
    reports: Report[];
}

export const useGlobalSearch = (query: string) => {
    return useQuery({
        queryKey: ['global-search', query],
        queryFn: async () => {
            if (!query || query.length < 2) {
                return { buildings: [], facilities: [], reports: [] } as SearchResults;
            }

            const [buildingsRes, facilitiesRes, reportsRes] = await Promise.all([
                api.get(`/buildings/search?q=${query}`),
                api.get(`/facilities/search?q=${query}`),
                api.get(`/reports/search?q=${query}`),
            ]);

            return {
                buildings: buildingsRes.data.data as Building[],
                facilities: facilitiesRes.data.data as Facility[],
                reports: reportsRes.data.data as Report[],
            } as SearchResults;
        },
        enabled: query.length >= 2,
        staleTime: 1000 * 60, // 1 minute
    });
};
