import { create } from "zustand";
import { addMoneyApi, getAllUsersApi, getWalletHistory } from "../api/walletApi";

interface WalletHistory {
  name: string;
  employeeId: string;
  payment: number;
  type: string;
  description: string;
  walletBalance: number;
  walletPending: number;
  date: string;
  time: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  wallet: number;
  pending: number;
}

interface WalletState {
  walletHistory: WalletHistory[];
  users: User[];

  isLoading: boolean;
  error: string | null;

  getWalletHistory: () => Promise<void>;
  clearWalletHistory: () => void;
  getAllUsers: () => Promise<void>;
  addMoney: (userId: string, amount: number) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  walletHistory: [],
  users: [],
  isLoading: false,
  error: null,

  getWalletHistory: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await getWalletHistory();

      const formatted = (res.data || []).map((item: any) => ({
        name: item.name,
        employeeId: item.email,
        payment: item.payment,
        type: item.type,
        description: item.description,
        walletBalance: item.walletBalance,
        walletPending: item.walletPending,
        date: item.date,
        time: item.time,
      }));

      set({
        walletHistory: formatted,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },


  getAllUsers: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await getAllUsersApi();

      set({
        users: res.data,
        isLoading: false,
      });

    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },

  addMoney: async (userId, amount) => {
    set({ isLoading: true, error: null });

    try {
      await addMoneyApi(userId, amount);

      set({ isLoading: false });

    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },

  clearWalletHistory: () => {
    set({ walletHistory: [] });
  },
}));