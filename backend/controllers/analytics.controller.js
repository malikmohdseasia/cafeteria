import { getAnalyticsService } from "../services/analytics.service.js";
import { exportAnalyticsService } from "../services/export.service.js";

export const getAnalyticsController = async (req, res) => {
  try {
    const { type } = req.params;
    const { range } = req.query;

    const data = await getAnalyticsService(type, range);

    res.status(200).json({
      success: true,
      type,
      range,
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};





export const exportAnalyticsController = async (req, res) => {
  try {
    const { type, range = "today", format } = req.query;

    const filePath = await exportAnalyticsService(type, range, format);

    res.download(filePath);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};