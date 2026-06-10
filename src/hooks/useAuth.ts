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
            return data;
        },
        onSuccess: (data) => {
            setAuth(data.user, data.access_token);
            toast.success('Successfully logged in');
            navigate('/');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (userData: any) => {
            const { data } = await api.post('/register', userData);
            return data;
        },
        onSuccess: (data) => {
            setAuth(data.user, data.access_token);
            toast.success('Registration successful');
            navigate('/');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await api.post('/logout');
        },
        onSuccess: () => {
            clearAuth();
            toast.success('Logged out successfully');
            navigate('/login');
        },
    });

    return {
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        register: registerMutation.mutate,
        isRegistering: registerMutation.isPending,
        logout: logoutMutation.mutate,
    };
};
