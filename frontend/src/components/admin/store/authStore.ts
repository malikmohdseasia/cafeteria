import { create } from "zustand";
import { persist } from "zustand/middleware";
import { sendOtpApi, verifyOtpApi, signupApi, pendingPaymentUsers, searchPendingPaymentUsers, downloadPendingUsers } from "../../../api/authApi";

interface AuthState {
  name: string;
  email: string;
  token: string | null;
  role: string | null;
  isLoading: boolean;
  error: string | null;
  pendingUsers: [];


  sendOtp: (email: string) => Promise<boolean>;
  fetchPendingUsers: () => Promise<boolean>;
  searchPendingUsers: (query: string) => Promise<void>;
  downloadPendingUsers: () => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>;
  signup: (name: string, email: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      name: "",
      email: "",
      token: null,
      role: null,
      isLoading: false,
      error: null,
      pendingUsers: [],

      sendOtp: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await sendOtpApi(email);
          set({ email, isLoading: false });
          return true;
        } catch (err: any) {
          set({
            error: err.response?.data?.message || err.message,
            isLoading: false,
          });
          return false;
        }
      },

      verifyOtp: async (otp) => {
        const { email } = get();
        set({ isLoading: true, error: null });

        try {
          const res = await verifyOtpApi(email, otp);

          console.log("VERIFY RESPONSE:", res); // 🔍 debug

          const token = res.data.token;
          const role = res.data.user.role;
          console.log(role)

          set({ token, role, isLoading: false });

          return true;
        } catch (err: any) {
          set({
            error: err.response?.data?.message || err.message,
            isLoading: false,
          });
          return false;
        }
      },

      signup: async (name, email) => {
        set({ isLoading: true, error: null });
        try {
          await signupApi(name, email);
          set({ name, email, isLoading: false });
          return true;
        } catch (err: any) {
          set({
            error: err.response?.data?.message || err.message,
            isLoading: false,
          });
          return false;
        }
      },

      fetchPendingUsers: async () => {
        const { role } = get();

        if (role !== "ADMIN") {
          set({ error: "Access denied" });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const data = await pendingPaymentUsers();
          set({
            pendingUsers: data.data || [],
            isLoading: false,
          });
        } catch (err: any) {
          set({
            error: err.response?.data?.message || err.message,
            isLoading: false,
          });
        }
      },

      searchPendingUsers: async (query: string) => {
        const { role } = get();
        if (role !== "ADMIN") return set({ error: "Access denied" });
        set({ isLoading: true, error: null });
        try {
          const data = await searchPendingPaymentUsers(query);
          set({ pendingUsers: data.data || [], isLoading: false });
        } catch (err: any) {
          set({ error: err.response?.data?.message || err.message, isLoading: false });
        }
      },

      downloadPendingUsers: async (format: "pdf" | "excel") => {
        try {
          const res = await downloadPendingUsers(format);

          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");

          link.href = url;
          link.setAttribute(
            "download",
            `pending-users.${format === "excel" ? "xlsx" : "pdf"}`
          );

          document.body.appendChild(link);
          link.click();
        } catch (err: any) {
          set({
            error: err.response?.data?.message || err.message,
          });
        }
      },  

      logout: () => {
        set({ token: null });
      },
    }),
    {
      name: "auth-storage",

      partialize: (state) => ({
        token: state.token,
        role: state.role
      }),
    }
  )
);