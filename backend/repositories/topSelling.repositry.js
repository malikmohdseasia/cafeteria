import Order from "../ models/order.model.js";

export const fetchTopSellingByCategory = async (matchFilter) => {
  return Order.aggregate([
    { $match: matchFilter },

    { $unwind: "$items" },

    {
      $group: {
        _id: {
          productId: "$items.product",
          categoryName: "$items.categoryName",
        },
        totalSold: { $sum: "$items.quantity" },
        price: { $first: "$items.price" },
      },
    },

    {
      $lookup: {
        from: "foods",
        localField: "_id.productId",
        foreignField: "_id",
        as: "foodDetails",
      },
    },

    { $unwind: "$foodDetails" },

    {
      $project: {
        _id: 0,
        category: { $ifNull: ["$_id.categoryName", "Uncategorized"] },
        foodName: "$foodDetails.name",
        price: 1,
        totalSold: 1,
      },
    },

    { $sort: { totalSold: -1 } },

    {
      $setWindowFields: {
        sortBy: { totalSold: -1 },
        output: {
          rank: { $rank: {} }
        }
      }
    }
  ]);
};