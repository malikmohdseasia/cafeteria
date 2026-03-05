import WalletHistory from "../ models/walletHistory.model.js";

export const createHistory = (data) => {
  return WalletHistory.create(data);
};

export const getHistoryByUser = (userId) => {
  return WalletHistory.find({ user: userId }).sort({ createdAt: -1 });
};