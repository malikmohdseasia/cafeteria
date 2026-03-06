import * as notificationRepo from "../repositories/notification.repositry.js";

export const createNotificationService = async (data) => {
  return notificationRepo.createNotification(data);
};

export const getNotificationsService = async () => {
  return notificationRepo.getNotifications();
};

export const markNotificationsRead = async () => {
  await notificationRepo.markAllRead();
};