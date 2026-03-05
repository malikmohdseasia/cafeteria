import { create } from "zustand";
import {
  downloadPendingOrdersApi,
  downloadHistoryOrdersApi,
  fetchTopSellingApi,
  fetchRevenueDataApi,
} from "../api/analyticsApi";

interface AnalyticsState {
  topSelling: any[];
  revenueData: any[];
  fetchTopSelling: (range: string) => Promise<void>;
  fetchRevenueData:(range:string)=>Promise<void>;

  downloadOrders: (
    type: "pending" | "history",
    range: string,
    format: "pdf" | "excel"
  ) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  revenueData:[],
  topSelling: [],

  fetchTopSelling: async (range) => {
    try {
      const response = await fetchTopSellingApi(range);

      set({
        topSelling: response.data.data,
      });
    } catch (error) {
      console.error("Fetch top selling failed", error);
    }
  },

  fetchRevenueData: async(range)=>{
    try{
      const response = await fetchRevenueDataApi(range);

      set({
        revenueData: response?.data?.data?.dailyRevenue,
      });
    }catch(error){
      console.log("fetching revenue failed", error)
    }
  },

  downloadOrders: async (type, range, format) => {
    try {
      const response =
        type === "pending"
          ? await downloadPendingOrdersApi(range, format)
          : await downloadHistoryOrdersApi(range, format);

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${type}-orders-${range}.${format === "excel" ? "xlsx" : "pdf"}`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  },
}));