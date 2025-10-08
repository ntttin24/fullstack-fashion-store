import { create } from 'zustand';
import { useCartStore } from './cart';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'SUPPORT';
  phone?: string;
  address?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true, isLoading: false });
    
    // Sync local cart with backend when user logs in
    const cartStore = useCartStore.getState();
    const localItems = cartStore.items;
    
    if (localItems.length > 0) {
      // If there are local items, sync them to backend
      await cartStore.syncCartToBackend();
    } else {
      // If no local items, load cart from backend
      await cartStore.loadCartFromBackend();
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    
    // Keep local cart but clear backend sync
    // User can continue shopping without losing their cart
  },

  initAuth: async () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ user, token, isAuthenticated: true, isLoading: false });
          
          // Load cart from backend when initializing auth
          const cartStore = useCartStore.getState();
          await cartStore.loadCartFromBackend();
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          set({ isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    }
  },
}));




