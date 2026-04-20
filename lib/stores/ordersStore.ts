import { create } from 'zustand';
import type { Order, OrderStatus } from '@/lib/mockData';
import * as api from '@/lib/api';

interface OrderFilters {
  status: OrderStatus | 'all';
  search: string;
}

interface OrdersState {
  orders: Order[];
  selectedOrderId: string | null;
  filters: OrderFilters;
  isLoading: boolean;
  error: string | null;
  _pollTimer: ReturnType<typeof setInterval> | null;

  // Actions
  fetchOrders: () => Promise<void>;
  selectOrder: (id: string | null) => void;
  setFilters: (filters: Partial<OrderFilters>) => void;
  updateStatus: (id: string, status: OrderStatus) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  flagAsFraud: (id: string) => Promise<void>;
  resendPaymentLink: (id: string) => Promise<void>;
  startPolling: (intervalMs?: number) => void;
  stopPolling: () => void;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  selectedOrderId: null,
  filters: { status: 'all', search: '' },
  isLoading: false,
  error: null,
  _pollTimer: null,

  fetchOrders: async () => {
    const { filters } = get();
    set({ isLoading: true, error: null });
    try {
      const orders = await api.getOrders({
        status: filters.status === 'all' ? undefined : filters.status,
        search: filters.search || undefined,
      });
      set({ orders, isLoading: false });
    } catch {
      set({ error: 'Failed to fetch orders', isLoading: false });
    }
  },

  selectOrder: (id) => set({ selectedOrderId: id }),

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().fetchOrders();
  },

  updateStatus: async (id, status) => {
    // Optimistic update
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
      ),
    }));
    try {
      const updated = await api.updateOrderStatus(id, status);
      if (updated) {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? updated : o)),
        }));
      }
    } catch {
      get().fetchOrders(); // Rollback on failure
    }
  },

  cancelOrder: async (id) => {
    try {
      const updated = await api.cancelOrder(id);
      if (updated) {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? updated : o)),
        }));
      }
    } catch {
      get().fetchOrders();
    }
  },

  flagAsFraud: async (id) => {
    try {
      const updated = await api.flagAsFraud(id);
      if (updated) {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? updated : o)),
        }));
      }
    } catch {
      get().fetchOrders();
    }
  },

  resendPaymentLink: async (id) => {
    try {
      const updated = await api.resendPaymentLink(id);
      if (updated) {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? updated : o)),
        }));
      }
    } catch {
      // silent
    }
  },

  startPolling: (intervalMs = 5000) => {
    const existing = get()._pollTimer;
    if (existing) clearInterval(existing);
    const timer = setInterval(() => {
      get().fetchOrders();
    }, intervalMs);
    set({ _pollTimer: timer });
  },

  stopPolling: () => {
    const timer = get()._pollTimer;
    if (timer) {
      clearInterval(timer);
      set({ _pollTimer: null });
    }
  },
}));
