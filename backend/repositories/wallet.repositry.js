import walletModel from "../ models/wallet.model.js";

export const filterWalletByPending = async (type, amount) => {
  let filter = {};

  if (type === "gt") {
    filter.pending = { $gt: amount };
  } else if (type === "lt") {
    filter.pending = { $lt: amount };
  }

  return walletModel.find(filter)
    .populate("user", "name email")
    .sort({ pending: -1 });
};

export const createWalletForUser = async (userId) => {
  const wallet = new walletModel({
    user: userId,
    balance: 0,
    pending: 0,
  });

  return wallet.save();
};