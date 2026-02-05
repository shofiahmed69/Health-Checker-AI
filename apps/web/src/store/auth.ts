import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profilePictureUrl: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  getToken: () => string | null;
}

async function apiFetch(url: string, options: RequestInit = {}, token?: string | null) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${url}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,

      login: async (email, password) => {
        const data = await apiFetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        set({ user: data.data.user, token: data.data.token, isLoading: false });
      },

      register: async (email, password, firstName, lastName) => {
        const data = await apiFetch('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ email, password, firstName, lastName }),
        });
        set({ user: data.data.user, token: data.data.token, isLoading: false });
      },

      logout: () => set({ user: null, token: null }),

      checkAuth: async () => {
        let token = get().token;
        if (!token && typeof window !== 'undefined') {
          try {
            const stored = localStorage.getItem('healthtrack-auth');
            if (stored) token = JSON.parse(stored)?.state?.token ?? null;
          } catch {}
        }
        if (!token) {
          set({ isLoading: false });
          return;
        }
        try {
          const data = await apiFetch('/api/user/profile', { headers: {} }, token);
          set({ user: { ...data.data, id: data.data.id }, isLoading: false });
        } catch {
          set({ user: null, token: null, isLoading: false });
        }
      },

      getToken: () => get().token,
    }),
    { name: 'healthtrack-auth' }
  )
);
