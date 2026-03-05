import Order from "../ models/order.model.js";

export const createOrder = async (orderData) => {
  return await Order.create(orderData);
};

export const getUserOrders = (userId) => {
  return Order.find({ user: userId }).sort({ createdAt: -1 });
};


export const findOrderById = (orderId) => {
  return Order.findById(orderId);
};

export const updateOrderStatusById = (orderId, status) => {
  return Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );
};


export const getTopSellingByCategory = async (limit = 5) => {
  return await Order.aggregate([
    { $match: { status: "PLACED" } },

    { $unwind: "$items" },

    {
      $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" },
      },
    },

    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },

    {
      $lookup: {
        from: "categories",
        localField: "product.category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },

    {
      $group: {
        _id: "$category.name",
        products: {
          $push: {
            productId: "$product._id",
            name: "$product.name",
            price: "$product.price",
            totalSold: "$totalSold",
          },
        },
      },
    },

    {
      $project: {
        _id: 0,
        category: "$_id",
        products: {
          $slice: [
            {
              $sortArray: {
                input: "$products",
                sortBy: { totalSold: -1 },
              },
            },
            limit,
          ],
        },
      },
    },
  ]);
};



export const fetchTopUsers = async (limit = 5, startDate = null, endDate = null) => {
  const match = { status: "PLACED" };
  if (startDate && endDate) {
    match.createdAt = { $gte: startDate, $lte: endDate };
  }

  return Order.aggregate([
    { $match: match },

    {
      $group: {
        _id: "$user",
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: "$totalAmount" },
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },

    {
      $project: {
        _id: 0,
        userId: "$user._id",
        name: "$user.name",
        email: "$user.email",
        totalOrders: 1,
        totalSpent: 1,
      },
    },

    { $sort: { totalOrders: -1 } },

    { $limit: limit },
  ]);
};










export const getMostOrderedTimeSlot = async () => {
  const slots = [
    { name: "Breakfast", start: 8 * 60, end: 11 * 60 },
    { name: "Lunch", start: 12 * 60, end: 15 * 60 },
    { name: "Snacks", start: 16 * 60, end: 18 * 60 },
    { name: "Dinner", start: 19 * 60, end: 22 * 60 },
  ];

  const orders = await Order.aggregate([
    { $match: { status: "PLACED" } },
    {
      $project: {
        hour: { $hour: "$createdAt" },
      },
    },
  ]);

  const slotCounts = slots.map((slot) => {
    const count = orders.filter(
      (o) => o.hour * 60 >= slot.start && o.hour * 60 < slot.end
    ).length;
    return { name: slot.name, totalOrders: count };
  });

  slotCounts.sort((a, b) => b.totalOrders - a.totalOrders);

  return slotCounts[0];
};






export const getRevenueStats = async (startDate, endDate) => {
  return await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 },
        paidRevenue: {
          $sum: {
            $cond: [
              { $eq: ["$paymentStatus", "PAID"] },
              "$totalAmount",
              0
            ]
          }
        },
        pendingRevenue: {
          $sum: {
            $cond: [
              { $eq: ["$paymentStatus", "PENDING"] },
              "$totalAmount",
              0
            ]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
        totalOrders: 1,
        paidRevenue: 1,
        pendingRevenue: 1
      }
    }
  ]);
};



export const fetchAllOrders = async ({
  page = 1,
  limit = 10,
  paymentStatus,
  status,
  startDate,
  endDate,
}) => {
  const skip = (page - 1) * limit;

  // 🔥 Build dynamic filter
  const filter = {};

  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }

  if (status) {
  if (Array.isArray(status)) {
    filter.status = { $in: status };
  } else {
    filter.status = status;
  }
}

  if (startDate && endDate) {
    filter.createdAt = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  const orders = await Order.find(filter)
   .populate("user", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(filter);

  return {
    orders,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};



export const fetchPendingOrders = async (startDate, endDate) => {
  return Order.find({
    status: "PENDING",
    createdAt: { $gte: startDate, $lte: endDate }
  })
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};


export const fetchConfirmedOrders = async (startDate, endDate) => {
  return Order.find({
    paymentStatus: { $in: ["PAID", "PENDING"] },
    status: "CONFIRMED",
    createdAt: { $gte: startDate, $lte: endDate }
  })
    .populate("user", "name email")
    .populate("items.product", "name price")
    .sort({ createdAt: -1 });
};

export const findById = (orderId) => {
  return Order.findById(orderId);
};

export const updateStatus = (orderId, status) => {
  return Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );
};

export const cancelOrderById = (orderId) => {
  return Order.findByIdAndUpdate(
    orderId,
    { status: "CANCELLED" },
    { new: true }
  );
};


export const getRecentOrders = async () => {
  return await Order.find()
    .populate("user", "name email") 
    .sort({ createdAt: -1 }) 
};