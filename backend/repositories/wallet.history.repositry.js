import WalletHistory from "../ models/walletHistory.model.js";

export const createHistory = (data) =>
  WalletHistory.create(data);

export const getAllHistory = () =>
  WalletHistory.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });