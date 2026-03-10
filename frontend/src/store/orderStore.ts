import { create } from "zustand";
import {
  cancelOrderApi,
  fetchOrdersApi,
  fetchPendingOrdersApi,
  fetchRecentOrdersApi,
  updateStatusOrder,
  fetchNotificationsApi,
  markNotificationsReadApi,
  fetchOrdersByStatusApi,
  searchOrdersApi,
  searchPendingOrdersApi
} from "../api/OrderApi";

interface Order {
  date: string;
  orderId: string;
  employeeId: string;
  employeeName: string;
  orderStatus: string;
  totalAmount: number;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
}

interface OrderState {
  recentOrders: [];
  orders: Order[];
  pendingOrders: Order[];
  notifications: Notification[];

  isLoading: boolean;
  error: string | null;

  fetchOrders: (range?: string) => Promise<void>;
  fetchRecentOrders: () => Promise<void>;
  fetchPendingOrders: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markNotificationsRead: () => Promise<void>;
  fetchOrdersByStatus: (status: string) => Promise<void>;
  searchOrders: (query: string) => Promise<void>;
  searchPendingOrders: (query: string) => Promise<void>;

  clearOrders: () => void;

  updateOrderStatus: (id: string, status: string) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  recentOrders: [],
  orders: [],
  pendingOrders: [],
  notifications: [],

  isLoading: false,
  error: null,


  fetchOrders: async (range?: string) => {
    set({ isLoading: true, error: null });

    try {
      const data = await fetchOrdersApi(range);

      set({
        orders: data.orders || [],
        isLoading: false,
      });

    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },


  fetchPendingOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchPendingOrdersApi();

      set({
        pendingOrders: data?.data || [],
        isLoading: false,
      });

    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },

  searchPendingOrders: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const data = await searchPendingOrdersApi(query);

      set({
        pendingOrders: data?.data?.[0]?.orders || [],
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },

  fetchRecentOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchRecentOrdersApi();
      set({ recentOrders: data.data || [], isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },

  fetchNotifications: async () => {
    try {
      const res = await fetchNotificationsApi();

      set({
        notifications: res.data || []
      });

    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message
      });
    }
  },

  clearOrders: () => {
    set({ orders: [], pendingOrders: [] });
  },

  cancelOrder: async (orderId: string) => {
    await cancelOrderApi(orderId);

    set((state: any) => ({
      orders: state.orders.filter(
        (order: any) => order._id !== orderId
      ),
    }));
  },

  updateOrderStatus: async (userId: string, status: string) => {
    await updateStatusOrder(userId, status);

    set((state) => ({
      pendingOrders: state.pendingOrders.filter(
        (order: any) => order.orders?.[0]?.user?._id !== userId
      ),
    }));
  },

  markNotificationsRead: async () => {
    await markNotificationsReadApi();

    set((state) => ({
      notifications: state.notifications.map((n: any) => ({
        ...n,
        isRead: true,
      })),
    }));
  },
  fetchOrdersByStatus: async (status) => {
    set({ isLoading: true, error: null });

    try {
      const data = await fetchOrdersByStatusApi(status);

      set({
        orders: data.data || [],
        isLoading: false,
      });

    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },

  searchOrders: async (query) => {
    set({ isLoading: true, error: null });

    try {
      const data = await searchOrdersApi(query);

      set({
        orders: data.data || [],
        isLoading: false,
      });

    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },

  // searchPendingOrders: async (query: string) => {
  //   set({ isLoading: true, error: null });

  //   try {
  //     const data = await searchPendingOrdersApi(query);

  //     set({
  //       pendingOrders: data?.data?.[0]?.orders || [],
  //       isLoading: false,
  //     });
  //   } catch (err: any) {
  //     set({
  //       error: err.response?.data?.message || err.message,
  //       isLoading: false,
  //     });
  //   }
  // },

}));