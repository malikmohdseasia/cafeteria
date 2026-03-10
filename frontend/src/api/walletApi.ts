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

export const filterWalletApi = (type: string, amount: number) =>
  axiosInstance
    .get(`/wallet/filter?type=${type}&amount=${amount}`)
    .then((res) => res.data);

export const downloadWalletHistoryApi = (format: "pdf" | "excel") => {
  return axiosInstance.get(`/wallet/wallet-history/download?format=${format}`, {
    responseType: "blob",
  });
};