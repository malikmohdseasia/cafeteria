import { HTTP_STATUS } from "../constants/httpStatus.js";
import * as notificationService from "../services/notification.service.js";

export const getNotificationsController = async (req, res) => {
  try {
    const data = await notificationService.getNotificationsService();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });

  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};


export const markNotificationsRead = async (req, res, next) => {
  try {
    await notificationService.markNotificationsRead();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Notifications marked as read",
    });
  } catch (err) {
    next(err);
  }
};