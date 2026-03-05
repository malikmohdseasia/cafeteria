import { axiosInstance } from "./axiosInstance";

export const fetchOrdersApi = () =>
  axiosInstance.get("orders/history").then(res => res.data);

export const fetchPendingOrdersApi = () =>
  axiosInstance.get("orders/pending").then(res => res.data);

export const updateStatusOrder = (orderId: string, status: string) =>
  axiosInstance.patch(`orders/${orderId}/status`, { status }).then(res => res.data);

export const cancelOrderApi = (orderId: any) =>
  axiosInstance.patch(`orders/${orderId}/cancel`).then(res => res.data)


export const fetchRecentOrdersApi = () =>
  axiosInstance.get("orders/recent").then(res => res.data);