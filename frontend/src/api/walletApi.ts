import { axiosInstance } from "./axiosInstance";

export const getWalletHistory = () =>
  axiosInstance.get("/wallet/wallet-history").then(res => res.data);

export const getAllUsersApi = () =>
  axiosInstance.get("wallet/all-users").then(res => res.data);

export const addMoneyApi = (userId: string, amount: number) =>
  axiosInstance.post("/wallet/add-money", {
    userId,
    amount,
  });