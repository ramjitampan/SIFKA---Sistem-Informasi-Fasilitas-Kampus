import { create } from 'zustand';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'staff' | 'admin';
}

interface AuthState {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string, remember: boolean) => void;
    clearAuth: () => void;
    isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user') || 'null'),
    token: sessionStorage.getItem('access_token') || localStorage.getItem('access_token'),
    
    setAuth: (user, token, remember) => {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(user));
        storage.setItem('access_token', token);
        set({ user, token });
    },
    
    clearAuth: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('access_token');
        set({ user: null, token: null });
    },
    
    isAuthenticated: () => !!get().token,
}));
