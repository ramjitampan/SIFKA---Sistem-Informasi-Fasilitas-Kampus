/* @jsxImportSource react */
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from './useAuth';
import api from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

vi.mock('../lib/axios', () => ({
    default: {
        post: vi.fn(),
    },
}));

vi.mock('../store/useAuthStore', () => ({
    useAuthStore: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useAuth hook', () => {
    const mockClearAuth = vi.fn();
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuthStore as any).mockReturnValue({
            clearAuth: mockClearAuth,
        });
        (useNavigate as any).mockReturnValue(mockNavigate);
    });

    it('should clear auth and navigate to login on successful logout', async () => {
        (api.post as any).mockResolvedValue({});
        const { result } = renderHook(() => useAuth(), { wrapper });

        await result.current.logout();

        expect(api.post).toHaveBeenCalledWith('/logout');
        expect(mockClearAuth).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('should clear auth and navigate to login even on 401 error', async () => {
        (api.post as any).mockRejectedValue({
            response: { status: 401 },
        });
        const { result } = renderHook(() => useAuth(), { wrapper });

        await result.current.logout();

        expect(api.post).toHaveBeenCalledWith('/logout');
        expect(mockClearAuth).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});
