import { HTTP_STATUS } from "../constants/httpStatus.js";
import { getAdminDashboardData } from "../services/dashboard.service.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const data = await getAdminDashboardData();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};