import Order from "../ models/order.model.js";

export const fetchTopSellingByCategory = async () => {
  return Order.aggregate([
    {
      $match: {
        status: "CONFIRMED",
      },
    },

    { $unwind: "$items" },

    {
      $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" },
        price: { $first: "$items.price" },
        category: { $first: "$items.categoryName" },
      },
    },

    {
      $lookup: {
        from: "foods",
        localField: "_id",
        foreignField: "_id",
        as: "foodDetails",
      },
    },

    { $unwind: "$foodDetails" },

    {
      $project: {
        _id: 0,
        foodId: "$foodDetails._id",
        foodName: "$foodDetails.name",
        category: { $ifNull: ["$category", "Uncategorized"] },
        price: 1,
        totalSold: 1,
      },
    },

    { $sort: { totalSold: -1 } },

    {
      $setWindowFields: {
        sortBy: { totalSold: -1 },
        output: {
          rank: { $rank: {} },
        },
      },
    },
  ]);
};