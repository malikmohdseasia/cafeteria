import Order from "../ models/order.model.js";
import User from "../ models/user.model.js";
import WalletHistory from "../ models/walletHistory.model.js";

export const getAdminDashboardData = async () => {

  const today = new Date();

  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0, 0, 0
  );

  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23, 59, 59
  );

  const pendingOrders = await Order.countDocuments({
    status: "PENDING",
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  const revenueData = await Order.aggregate([
    {
      $match: {
        paymentStatus: "PAID",
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const totalRevenue =
    revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

 const dailyUsers = await Order.distinct("user", {
  createdAt: { $gte: startOfDay, $lte: endOfDay },
});

const totalCustomers = dailyUsers.length;

  const adminRechargeData = await WalletHistory.aggregate([
    {
      $match: {
        type: "credit",
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      },
    },
    {
      $group: {
        _id: null,
        totalAdminRecharge: { $sum: "$amount" },
      },
    },
  ]);

  const totalAdminRecharge =
    adminRechargeData.length > 0
      ? adminRechargeData[0].totalAdminRecharge
      : 0;

  return {
    pendingOrders,
    totalRevenue,
    totalCustomers,
    totalAdminRecharge,
  };
};