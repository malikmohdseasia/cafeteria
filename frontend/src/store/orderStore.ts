import { create } from "zustand";
import { cancelOrderApi, fetchOrdersApi, fetchPendingOrdersApi, fetchRecentOrdersApi, updateStatusOrder } from "../api/OrderApi";

interface Order {
  date: string;
  orderId: string;
  employeeId: string;
  employeeName: string;
  orderStatus: string;
  totalAmount: number;
}

interface OrderState {
  recentOrders:[];
  orders: Order[];
  pendingOrders: Order[];
  isLoading: boolean;
  error: string | null;

  fetchOrders: () => Promise<void>;
  fetchRecentOrders: () => Promise<void>;
  fetchPendingOrders: () => Promise<void>;
  clearOrders: () => void;
  updateOrderStatus:(id: string, status: string)=>void;
}

export const useOrderStore = create<OrderState>((set) => ({
  recentOrders:[],
  orders: [],
  pendingOrders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchOrdersApi();
      set({ orders: data.orders|| [], isLoading: false });
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

      set({ pendingOrders: data.data || [], isLoading: false });
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

updateOrderStatus: async (id: string, status: string) => {
    await updateStatusOrder(id, status);
    set((state) => ({
      pendingOrders: state.pendingOrders.filter(
        (order:any) => order._id !== id
      ),
    }));
  },


}));


