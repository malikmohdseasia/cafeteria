import * as notificationRepo from "../repositories/notification.repositry.js";

export const createNotificationService = async (data) => {
  return notificationRepo.createNotification(data);
};

export const getNotificationsService = async () => {
  const notifications = await notificationRepo.getNotifications();

  return notifications.map((n) => ({
    notificationId: n._id,
    title: n.title,
    message: n.message,
    orderId: n.orderId?._id,
    price: n.orderId?.totalAmount,
    name: n.orderId?.user?.name,
    email: n.orderId?.user?.email,
    createdAt: n.createdAt,
    isRead: n.isRead,
  }));
};

export const markNotificationsRead = async () => {
  await notificationRepo.markAllRead();
};