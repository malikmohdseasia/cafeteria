import * as walletHistoryRepo from "../repositories/wallet.history.repositry.js";
import Wallet from "../ models/wallet.model.js";


export const getWalletHistoryWithWallet = async () => {
  const history = await walletHistoryRepo.getAllHistory();

  const formatted = await Promise.all(
    history.map(async (item) => {
      // 🔴 SAFETY CHECK
      if (!item.user) return null;

      const wallet = await Wallet.findOne({ user: item.user._id });

      const dateObj = new Date(item.createdAt);

      return {
        name: item.user.name,
        email: item.user.email,
        payment: item.amount,
        type: item.type,
        description: item.description,
        walletBalance: wallet?.balance || 0,
        walletPending: wallet?.pending || 0,
        date: dateObj.toLocaleDateString("en-GB"),
        time: dateObj.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      };
    })
  );

  // remove null entries
  return formatted.filter(item => item !== null);
};