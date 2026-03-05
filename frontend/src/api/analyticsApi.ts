import { axiosInstance } from "./axiosInstance";

export const downloadPendingOrdersApi = (range: string, format: string) => {
  return axiosInstance.get(
    `/orders/pending/download?range=${range}&format=${format}`,
    { responseType: "blob" } 
  );
};

export const downloadHistoryOrdersApi = (range: string, format: string) => {
  return axiosInstance.get(
    `/orders/history/download?range=${range}&format=${format}`,
    { responseType: "blob" }
  );
};

export const fetchTopSellingApi = (range: string) => {
  return axiosInstance.get(`/analytics/topselling?range=${range}`);
};

export const fetchRevenueDataApi = (range: string) => {
  return axiosInstance.get(`/analytics/revenue?range=${range}`);
};