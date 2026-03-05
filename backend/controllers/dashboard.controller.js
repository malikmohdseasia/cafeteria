import { getAdminDashboardData } from "../services/dashboard.service.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const data = await getAdminDashboardData();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};