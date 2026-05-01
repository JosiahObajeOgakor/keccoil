import { create } from 'zustand';

interface LoaderState {
  activeRequests: number;
  isLoading: boolean;
  start: () => void;
  end: () => void;
}

export const useLoaderStore = create<LoaderState>((set, get) => ({
  activeRequests: 0,
  isLoading: false,
  start: () => {
    const next = get().activeRequests + 1;
    set({ activeRequests: next, isLoading: true });
  },
  end: () => {
    const next = Math.max(0, get().activeRequests - 1);
    set({ activeRequests: next, isLoading: next > 0 });
  },
}));
