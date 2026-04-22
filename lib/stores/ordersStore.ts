import { create } from 'zustand';
import type { Order, OrderStatus } from '@/lib/types';
import * as api from '@/lib/api';

interface OrderFilters {
  status: OrderStatus | 'all';
  search: string;
}

interface OrdersState {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  selectedOrderId: number | null;
  filters: OrderFilters;
  isLoading: boolean;
  error: string | null;
  _pollTimer: ReturnType<typeof setInterval> | null;

  fetchOrders: () => Promise<void>;
  selectOrder: (id: number | null) => void;
  setFilters: (filters: Partial<OrderFilters>) => void;
  setPage: (page: number) => void;
  updateStatus: (id: number, status: OrderStatus) => Promise<void>;
  startPolling: (intervalMs?: number) => void;
  stopPolling: () => void;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  total: 0,
  page: 1,
  limit: 20,
  selectedOrderId: null,
  filters: { status: 'all', search: '' },
  isLoading: false,
  error: null,
  _pollTimer: null,

  fetchOrders: async () => {
    const { filters, page, limit } = get();
    set({ isLoading: true, error: null });
    try {
      const data = await api.getOrders({
        page,
        limit,
        status: filters.status === 'all' ? undefined : filters.status,
      });
      set({ orders: data.orders, total: data.total, isLoading: false });
    } catch {
      set({ error: 'Failed to fetch orders', isLoading: false });
    }
  },

  selectOrder: (id) => set({ selectedOrderId: id }),

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1,
    }));
    get().fetchOrders();
  },

  setPage: (page) => {
    set({ page });
    get().fetchOrders();
  },

  updateStatus: async (id, status) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status, updated_at: new Date().toISOString() } : o
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
      get().fetchOrders();
    }
  },

  startPolling: (intervalMs = 10000) => {
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
