import { axiosInstance } from "./axiosInstance";

export const searchWalletHistoryApi = (search: string) =>
  axiosInstance.get(`wallet/wallet-history/search?search=${search}`);