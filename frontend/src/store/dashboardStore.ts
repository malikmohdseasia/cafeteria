import { create } from "zustand";
import { fetchDailyDashboard } from "../api/dashboardApi";

interface DashboardData {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  pendingOrders: number;
}

interface DashboardState {
  dashboard: DashboardData | null;
  isLoading: boolean;
  error: string | null;

  fetchDashboard: () => Promise<void>;
  clearDashboard: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  dashboard: null,
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetchDailyDashboard();

      set({
        dashboard: response.data.data,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },

  clearDashboard: () => {
    set({ dashboard: null });
  },
}));