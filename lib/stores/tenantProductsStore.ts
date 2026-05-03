import { create } from 'zustand';
import type { TenantProduct } from '@/lib/types';
import * as api from '@/lib/api';

interface TenantProductsState {
  products: TenantProduct[];
  isLoading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
  addProduct: (data: Omit<TenantProduct, 'id' | 'created_at' | 'updated_at' | 'tenant_id'>) => Promise<void>;
  updateProduct: (id: number, data: Partial<TenantProduct>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export const useTenantProductsStore = create<TenantProductsState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await api.getTenantProducts();
      set({ products, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch products', isLoading: false });
    }
  },

  addProduct: async (data) => {
    try {
      const product = await api.createTenantProduct(data);
      set({ products: [product, ...get().products] });
    } catch (err) {
      throw err;
    }
  },

  updateProduct: async (id, data) => {
    try {
      const updated = await api.updateTenantProduct(id, data);
      set({ products: get().products.map((p) => (p.id === id ? updated : p)) });
    } catch (err) {
      throw err;
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.deleteTenantProduct(id);
      set({ products: get().products.filter((p) => p.id !== id) });
    } catch (err) {
      throw err;
    }
  },
}));
