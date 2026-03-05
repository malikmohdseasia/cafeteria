import Wallet from "../ models/wallet.model.js";
import WalletHistory from "../ models/walletHistory.model.js";
import * as userRepo from "../repositories/user.repository.js";

export const adminAddMoney = async (userId, amount) => {
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) throw new Error("Wallet not found");

  let remainingAmount = amount;

  if (wallet.pending > 0) {
    const pendingPaid = Math.min(wallet.pending, remainingAmount);
    wallet.pending -= pendingPaid;
    remainingAmount -= pendingPaid;

    await WalletHistory.create({
      user: userId,
      type: "debit",
      amount: pendingPaid,
      subtotal: wallet.balance,
      description: "Pending bill paid via admin top-up",
    });
  }

  if (remainingAmount > 0) {
    wallet.balance += remainingAmount;

    await WalletHistory.create({
      user: userId,
      type: "credit",
      amount: remainingAmount,
      subtotal: wallet.balance,
      description: "Added by admin",
    });
  }

  await wallet.save();

  await userRepo.updateUserWalletFields(
    userId,
    wallet.balance,
    wallet.pending
  );

  return {
    success: true,
    balance: wallet.balance,
    pending: wallet.pending,
  };
};