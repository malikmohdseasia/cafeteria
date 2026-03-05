import { axiosInstance } from "./axiosInstance";

export const sendOtpApi = (email: string) =>
  axiosInstance.post("/auth/send-otp", { email }).then(res => res.data);

export const verifyOtpApi = (email: string, otp: string) =>
  axiosInstance.post("/auth/verify-otp", { email, otp }).then(res => res.data);

export const signupApi = (name: string, email: string) =>
  axiosInstance.post("/auth/register", { name, email }).then(res => res.data);

export const pendingPaymentUsers = () =>
  axiosInstance.get("/auth/pending-users").then(res => res.data);