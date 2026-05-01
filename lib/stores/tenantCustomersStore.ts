import { create } from 'zustand';
import type { TenantCustomer, PaginatedTenantCustomers, TenantOrder } from '@/lib/types';
import * as api from '@/lib/api';

interface TenantCustomersState {
  customers: TenantCustomer[];
  total: number;
  page: number;
  limit: number;
  search: string;
  selectedCustomer: TenantCustomer | null;
  customerOrders: TenantOrder[];
  isLoading: boolean;
  error: string | null;

  fetchCustomers: () => Promise<void>;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  selectCustomer: (id: number) => Promise<void>;
  clearSelection: () => void;
}

export const useTenantCustomersStore = create<TenantCustomersState>((set, get) => ({
  customers: [],
  total: 0,
  page: 1,
  limit: 20,
  search: '',
  selectedCustomer: null,
  customerOrders: [],
  isLoading: false,
  error: null,

  fetchCustomers: async () => {
    const { page, limit, search } = get();
    set({ isLoading: true, error: null });
    try {
      const data: PaginatedTenantCustomers = await api.getTenantCustomers({
        search: search || undefined,
        page,
        limit,
      });
      set({ customers: data.customers, total: data.total, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch customers', isLoading: false });
    }
  },

  setSearch: (search) => {
    set({ search, page: 1 });
    get().fetchCustomers();
  },

  setPage: (page) => {
    set({ page });
    get().fetchCustomers();
  },

  selectCustomer: async (id) => {
    set({ isLoading: true });
    try {
      const [customer, ordersData] = await Promise.all([
        api.getTenantCustomer(id),
        api.getTenantCustomerOrders(id),
      ]);
      set({ selectedCustomer: customer, customerOrders: ordersData.orders, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch customer', isLoading: false });
    }
  },

  clearSelection: () => {
    set({ selectedCustomer: null, customerOrders: [] });
  },
}));
