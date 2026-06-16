import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useAuth = () => {
    const navigate = useNavigate();
    const { setAuth, clearAuth } = useAuthStore();

    const loginMutation = useMutation({
        mutationFn: async (credentials: any) => {
            const { data } = await api.post('/login', credentials);
            return { data, remember: credentials.remember };
        },
        onSuccess: ({ data, remember }) => {
            setAuth(data.user, data.access_token, remember);
            navigate('/');
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (userData: any) => {
            const { data } = await api.post('/register', userData);
            return { data };
        },
        onSuccess: ({ data }) => {
            setAuth(data.user, data.access_token, false);
            navigate('/');
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await api.post('/logout');
        },
        onSuccess: () => {
            clearAuth();
            navigate('/login');
        },
    });

    return {
        login: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        register: registerMutation.mutateAsync,
        isRegistering: registerMutation.isPending,
        logout: logoutMutation.mutateAsync,
    };
};
