import { create } from "zustand";
import { addMoneyApi, downloadWalletHistoryApi, filterWalletApi, getAllUsersApi, getWalletHistory } from "../../../api/walletApi";

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

  filterWalletUsers: (type: string, amount: number) => Promise<void>;
  getWalletHistory: () => Promise<void>;
  clearWalletHistory: () => void;
  getAllUsers: () => Promise<void>;
  addMoney: (userId: string, amount: number) => Promise<void>;
  downloadWalletHistory: (format: "pdf" | "excel") => Promise<void>;
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

  filterWalletUsers: async (type: string, amount: number) => {
    set({ isLoading: true, error: null });

    try {
      const res = await filterWalletApi(type, amount);

      const formatted = (res.data || []).map((item: any) => ({
        employeeId: item.user?.email,
        name: item.user?.name,
        pendingBill: item.pending,
        wallet: item.balance,
      }));

      set({
        users: formatted,
        isLoading: false,
      });

    } catch (err: any) {
      set({
        error: err.message,
        isLoading: false,
      });
    }
  },

  downloadWalletHistory: async (format: any) => {
    try {
      const response = await downloadWalletHistoryApi(format);

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `wallet-history.${format === "excel" ? "xlsx" : "pdf"}`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Wallet history download failed", error);
    }
  },

  clearWalletHistory: () => {
    set({ walletHistory: [] });
  },
}));