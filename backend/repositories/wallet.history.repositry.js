import WalletHistory from "../ models/walletHistory.model.js";
import User from "../ models/user.model.js";

export const createHistory = (data) =>
  WalletHistory.create(data);

export const getAllHistory = () =>
  WalletHistory.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });



export const searchWalletHistory = async (search) => {
  let filter = {};

  if (search) {
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).select("_id");

    const userIds = users.map((u) => u._id);

    filter.user = { $in: userIds };
  }

  return WalletHistory.find(filter)
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};