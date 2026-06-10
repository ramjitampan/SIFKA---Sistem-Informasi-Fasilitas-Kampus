import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { Coordinate } from './useBuildings';
import { Facility } from './useFacilities';
import { useEffect } from 'react';
import { echo } from '../lib/echo';

export interface Report {
    id: number;
    title: string;
    description: string;
    image_url: string | null;
    status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
    coordinate: Coordinate;
    user: {
        id: number;
        name: string;
    };
    facility?: Facility;
    created_at: string;
    updated_at: string;
}

export interface ReportsResponse {
    data: Report[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
    status_counts: {
        pending: string;
        in_progress: string;
        resolved: string;
        rejected: string;
    };
}

export const useReports = (page = 1, status?: string) => {
    return useQuery({
        queryKey: ['reports', page, status],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            if (status) params.append('status', status);
            
            const { data } = await api.get(`/reports?${params.toString()}`);
            return data as ReportsResponse;
        },
    });
};

export const useReport = (id: number | string | undefined) => {
    return useQuery({
        queryKey: ['reports', id],
        queryFn: async () => {
            if (!id) throw new Error('Report ID is required');
            const { data } = await api.get(`/reports/${id}`);
            return data.data as Report;
        },
        enabled: !!id,
    });
};

export const useCreateReport = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await api.post('/reports', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return data.data as Report;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
};

export const useUpdateReportStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: number; status: string }) => {
            const { data } = await api.put(`/reports/${id}`, { status });
            return data.data as Report;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
};

export const useDeleteReport = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/reports/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
};

export const useReportUpdates = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const channel = echo.private('reports')
            .listen('.ReportUpdated', (e: { report: Report }) => {
                queryClient.invalidateQueries({ queryKey: ['reports'] });
            });

        return () => {
            channel.stopListening('.ReportUpdated');
        };
    }, [queryClient]);
};
