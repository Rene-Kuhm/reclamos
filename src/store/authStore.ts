import { create } from 'zustand';
import { User } from '../types/auth';

interface AuthState {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (username: string, password: string) => {
    // Simulamos autenticación - En producción esto se conectaría a un backend
    if (username === 'admin' && password === 'admin123') {
      set({ user: { id: '1', username: 'admin', role: 'admin' } });
    } else if (username === 'tech' && password === 'tech123') {
      set({ user: { id: '2', username: 'tech', role: 'technician' } });
    } else {
      throw new Error('Credenciales inválidas');
    }
  },
  logout: () => set({ user: null }),
}));