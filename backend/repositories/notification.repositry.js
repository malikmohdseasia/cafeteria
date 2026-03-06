import Notification from "../ models/notification.model.js";

export const createNotification = (data) => {
  return Notification.create(data);
};

export const getNotifications = () => {
  return Notification.find().sort({ createdAt: -1 });
};

export const markAllRead = () => {
  return Notification.updateMany(
    { isRead: false },
    { $set: { isRead: true } }
  );
};