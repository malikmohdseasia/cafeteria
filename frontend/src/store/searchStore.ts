import { create } from "zustand";
import { searchWalletHistoryApi } from "../api/searchApi";

interface SearchData {
  _id: string;
  type: string;
  amount: number;
  subtotal: number;
  description: string;
  createdAt: string;

  user: {
    name: string;
    email: string;
  };
}

interface SearchState {
  searchData: SearchData[];
  isLoading: boolean;
  error: string | null;

  searchWallet: (search?: string) => Promise<void>;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchData: [],
  isLoading: false,
  error: null,

  searchWallet: async (search = "") => {
    set({ isLoading: true, error: null });

    try {
      const res = await searchWalletHistoryApi(search);

      set({
        searchData: res.data.data || [],
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },
}));