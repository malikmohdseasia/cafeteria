import Order from "../ models/order.model.js";

export const getRevenueAnalytics = async (startDate, endDate) => {
  return await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },

    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 }
      }
    },

    {
      $sort: { _id: 1 }
    },

    {
      $project: {
        _id: 0,
        date: "$_id",
        revenue: 1,
        orders: 1
      }
    }
  ]);
};

export const fetchPendingOrders = async (startDate, endDate) => {
  return Order.find({
    status: "PENDING",
    createdAt: { $gte: startDate, $lte: endDate }
  })
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};


export const getTopUsersAnalytics = async () => {
  return await Order.aggregate([
    {
      $group: {
        _id: "$user",
        totalSpent: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 }
      }
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userInfo"
      }
    },
    { $unwind: "$userInfo" },
    {
      $project: {
        _id: 0,
        name: "$userInfo.name",
        email: "$userInfo.email",
        totalSpent: 1,
        totalOrders: 1
      }
    }
  ]);
};