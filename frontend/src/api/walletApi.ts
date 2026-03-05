import { axiosInstance } from "./axiosInstance";

export const getWalletHistory = () =>
  axiosInstance.get("/wallet/wallet-history").then(res => res.data);