import { create } from 'zustand';
import type { TenantOrder, PaginatedTenantOrders } from '@/lib/types';
import * as api from '@/lib/api';

interface TenantOrderFilters {
  status: string;
}

interface TenantOrdersState {
  orders: TenantOrder[];
  total: number;
  page: number;
  limit: number;
  selectedOrderId: number | null;
  selectedOrder: TenantOrder | null;
  filters: TenantOrderFilters;
  isLoading: boolean;
  error: string | null;

  fetchOrders: () => Promise<void>;
  selectOrder: (id: number | null) => void;
  setFilters: (filters: Partial<TenantOrderFilters>) => void;
  setPage: (page: number) => void;
  updateStatus: (id: number, status: string) => Promise<void>;
}

export const useTenantOrdersStore = create<TenantOrdersState>((set, get) => ({
  orders: [],
  total: 0,
  page: 1,
  limit: 20,
  selectedOrderId: null,
  selectedOrder: null,
  filters: { status: '' },
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    const { page, limit, filters } = get();
    set({ isLoading: true, error: null });
    try {
      const data: PaginatedTenantOrders = await api.getTenantOrders({
        status: filters.status || undefined,
        page,
        limit,
      });
      set({ orders: data.orders, total: data.total, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch orders', isLoading: false });
    }
  },

  selectOrder: (id) => {
    const order = id ? get().orders.find((o) => o.id === id) ?? null : null;
    set({ selectedOrderId: id, selectedOrder: order });
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters }, page: 1 });
    get().fetchOrders();
  },

  setPage: (page) => {
    set({ page });
    get().fetchOrders();
  },

  updateStatus: async (id, status) => {
    try {
      await api.updateTenantOrderStatus(id, status);
      set({
        orders: get().orders.map((o) =>
          o.id === id ? { ...o, status: status as TenantOrder['status'] } : o
        ),
      });
      if (get().selectedOrderId === id) {
        set({ selectedOrder: { ...get().selectedOrder!, status: status as TenantOrder['status'] } });
      }
    } catch (err) {
      throw err;
    }
  },
}));
