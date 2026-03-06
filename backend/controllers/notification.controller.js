import * as notificationService from "../services/notification.service.js";

export const getNotificationsController = async (req, res) => {
  try {
    const data = await notificationService.getNotificationsService();

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const markNotificationsRead = async (req, res, next) => {
  try {
    await notificationService.markNotificationsRead();

    res.json({
      success: true,
      message: "Notifications marked as read",
    });
  } catch (err) {
    next(err);
  }
};