import * as walletHistoryRepo from "../repositories/wallet.history.repositry.js";

export const getWalletHistoryService = async () => {
  const history = await walletHistoryRepo.getAllHistory();

  const formatted = history.map((item) => ({
    name: item.user?.name,
    email: item.user?.email,
    payment: item.amount,
    wallet: item.walletBalance,
    type: item.type,
    description: item.description,
    date: item.createdAt.toLocaleDateString("en-IN"),
    time: item.createdAt.toLocaleTimeString("en-IN"),
  }));



  return {
    success: true,
    data: formatted,
  };
};