import * as analyticsRepo from "../repositories/analytics.repo.js";
import * as topSellingRepo from "../repositories/topSelling.repositry.js";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const getAnalyticsService = async (type, range = "today") => {

  let startDate;
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  let heading = "";

  if (range === "today") {
    startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    heading = "TODAY REVENUE";
  } else {
    const days = parseInt(range);
    if (isNaN(days)) throw new Error("Invalid range");

    startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    heading = `${days} DAYS REVENUE`;
  }

  const matchFilter = {
    createdAt: { $gte: startDate, $lte: endDate },
    status: "CONFIRMED"
  };

  switch (type) {

    case "revenue":
      const revenue = await analyticsRepo.getRevenueAnalytics(startDate, endDate);
      const totalRevenue = revenue.reduce((sum, day) => sum + day.revenue, 0);
      const totalOrders = revenue.reduce((sum, day) => sum + day.orders, 0);


      return {
        heading,
        from: formatDate(startDate),
        to: formatDate(endDate),
        dailyRevenue: revenue,
        totalRevenue,
        totalOrders
      };

    case "pending":
      return await analyticsRepo.fetchPendingOrders();

    case "topusers":
      return await analyticsRepo.getTopUsersAnalytics();

    case "topselling":
      return await topSellingRepo.fetchTopSellingByCategory();

    default:
      throw new Error("Invalid analytics type");
  }
};