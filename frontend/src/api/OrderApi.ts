import { axiosInstance } from "./axiosInstance";

export const fetchOrdersApi = (range?: string) =>
  axiosInstance
    .get(`orders/history${range ? `?range=${range}` : ""}`)
    .then((res) => res.data);

export const fetchPendingOrdersApi = () =>
  axiosInstance.get("orders/pending").then(res => res.data);

export const updateStatusOrder = (userId: string, status: string) =>
  axiosInstance.patch(`orders/${userId}/status`, { status }).then(res => res.data);

export const cancelOrderApi = (orderId: any) =>
  axiosInstance.patch(`orders/${orderId}/cancel`).then(res => res.data)


export const fetchRecentOrdersApi = () =>
  axiosInstance.get("orders/recent").then(res => res.data);

export const fetchNotificationsApi = () =>
  axiosInstance.get("/notifications").then(res => res.data);

export const markNotificationsReadApi = () =>
  axiosInstance.patch("/notifications/read").then(res => res.data);

export const fetchOrdersByStatusApi = (status: string) =>
  axiosInstance.get(`orders/status?status=${status}`).then(res => res.data);


export const searchOrdersApi = (query: string) =>
  axiosInstance.get(`orders/search?query=${query}`).then(res => res.data);

export const searchPendingOrdersApi = (search: string) =>
  axiosInstance
    .get(`orders/pending/search?search=${encodeURIComponent(search)}`)
    .then(res => res.data);