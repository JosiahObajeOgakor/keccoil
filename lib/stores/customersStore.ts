import { create } from 'zustand';
import type { Customer, Order, ConversationMessage } from '@/lib/mockData';
import * as api from '@/lib/api';

interface CustomersState {
  customers: Customer[];
  isLoading: boolean;
  error: string | null;

  // Per-customer detail
  selectedPhone: string | null;
  customerOrders: Order[];
  conversation: ConversationMessage[];
  isDetailLoading: boolean;

  // Actions
  fetchCustomers: () => Promise<void>;
  selectCustomer: (phone: string | null) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
}

export const useCustomersStore = create<CustomersState>((set, get) => ({
  customers: [],
  isLoading: false,
  error: null,
  selectedPhone: null,
  customerOrders: [],
  conversation: [],
  isDetailLoading: false,

  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const customers = await api.getCustomers();
      set({ customers, isLoading: false });
    } catch {
      set({ error: 'Failed to fetch customers', isLoading: false });
    }
  },

  selectCustomer: async (phone) => {
    set({ selectedPhone: phone, isDetailLoading: true });
    if (!phone) {
      set({ customerOrders: [], conversation: [], isDetailLoading: false });
      return;
    }
    try {
      const [customerOrders, conversation] = await Promise.all([
        api.getCustomerOrders(phone),
        api.getConversation(phone),
      ]);
      set({ customerOrders, conversation, isDetailLoading: false });
    } catch {
      set({ isDetailLoading: false });
    }
  },

  sendMessage: async (text) => {
    const { selectedPhone, conversation } = get();
    if (!selectedPhone) return;
    try {
      const msg = await api.sendMessage(selectedPhone, text);
      set({ conversation: [...conversation, msg] });
    } catch {
      // silent
    }
  },
}));
