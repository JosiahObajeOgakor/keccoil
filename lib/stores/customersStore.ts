import { create } from 'zustand';
import type { User, Order } from '@/lib/types';
import * as api from '@/lib/api';

interface CustomersState {
  user: User | null;
  userOrders: Order[];
  isLoading: boolean;
  error: string | null;

  lookupByPhone: (phone: string) => Promise<void>;
  clearUser: () => void;
  sendWhatsApp: (message: string) => Promise<void>;
}

export const useCustomersStore = create<CustomersState>((set, get) => ({
  user: null,
  userOrders: [],
  isLoading: false,
  error: null,

  lookupByPhone: async (phone) => {
    set({ isLoading: true, error: null, user: null, userOrders: [] });
    try {
      const user = await api.getUserByPhone(phone);
      const ordersData = await api.getMyOrders(phone, 1, 50);
      set({ user, userOrders: ordersData.orders, isLoading: false });
    } catch {
      set({ error: 'Customer not found', isLoading: false });
    }
  },

  clearUser: () => set({ user: null, userOrders: [], error: null }),

  sendWhatsApp: async (message) => {
    const { user } = get();
    if (!user) return;
    await api.forwardWhatsApp(user.phone, message);
  },
}));
