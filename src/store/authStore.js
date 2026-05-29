import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('sifka_user') || 'null'),
  token: localStorage.getItem('sifka_token') || null,
  isAuthenticated: !!localStorage.getItem('sifka_token'),

  setAuth: (user, token) => {
    localStorage.setItem('sifka_token', token);
    localStorage.setItem('sifka_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem('sifka_token');
    localStorage.removeItem('sifka_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
