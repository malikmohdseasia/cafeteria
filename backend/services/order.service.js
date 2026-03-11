
import Cart from "../ models/cart.model.js";
import WalletHistory from "../ models/walletHistory.model.js";
import * as orderRepo from "../repositories/order.repository.js";
import * as userRepo from "../repositories/user.repository.js";
import { MESSAGES } from "../constants/messages.js";
import mongoose from "mongoose";

export const createOrderFromCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) throw new Error(MESSAGES.CART_NOT_FOUND);
  if (cart.items.length === 0) throw new Error(MESSAGES.CART_EMPTY);

  let totalAmount = 0;
  const orderItems = [];

  for (const item of cart.items) {
    if (!item.product) {
      throw new Error(MESSAGES.PRODUCT_NOT_FOUND);
    }

    const price = item.product.price;
    const quantity = item.quantity;

    totalAmount += price * quantity;

    orderItems.push({
      product: item.product._id,
      quantity,
      price,
    });
  }

  const order = await orderRepo.createOrder({
    user: userId,
    items: orderItems,
    totalAmount,
  });

  cart.items = [];
  await cart.save();

  return order;
};

export const getOrdersByUser = (userId) => {
  return orderRepo.getUserOrders(userId);
};




export const updateOrderStatusService = async (orderId, status) => {
  if (!Object.values(ORDER_STATUS).includes(status)) {
    throw new Error("Invalid order status");
  }

  const order = await orderRepo.findOrderById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status === ORDER_STATUS.DELIVERED) {
    throw new Error("Delivered order cannot be updated");
  }

  return orderRepo.updateOrderStatusById(orderId, status);
};




export const getTopUsersService = async (range = "today", limit = 5) => {
  let startDate = null;
  const endDate = new Date();

  const now = new Date();
  switch (range) {
    case "today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "3days":
      startDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      break;
    case "7days":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "1month":
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  const topUsers = await orderRepo.fetchTopUsers(limit, startDate, endDate);

  return topUsers;
};


export const getPendingOrdersService = async (range = "today") => {
  const now = new Date();
  let startDate;

  if (range === "today") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else {
    const days = parseInt(range);
    startDate = !isNaN(days)
      ? new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
      : new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  const startUTC = new Date(startDate);
  startUTC.setHours(0, 0, 0, 0);

  const endUTC = new Date(now);
  endUTC.setHours(23, 59, 59, 999);

  const orders = await orderRepo.fetchPendingOrders(startUTC, endUTC);

  return orders;
};


export const getMostOrderedTimeSlotsService = async () => {
  const slots = await orderRepo.getMostOrderedTimeSlot();

  return {
    success: true,
    data: slots,
  };
};



export const getRevenueStatsService = async (range = "today") => {
  const now = new Date();
  let startDate;

  if (range === "today") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else {
    const days = parseInt(range);
    if (!isNaN(days)) {
      startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
  }

  const startUTC = new Date(startDate);
  startUTC.setHours(0, 0, 0, 0);

  const endUTC = new Date(now);
  endUTC.setHours(23, 59, 59, 999);

  const result = await orderRepo.getRevenueStats(startUTC, endUTC);

  return result[0] || {
    totalRevenue: 0,
    totalOrders: 0,
    paidRevenue: 0,
    pendingRevenue: 0
  };
};



export const getOrderHistoryService = async (queryParams) => {
  const { page, limit, paymentStatus, status, range } = queryParams;

  let startDate = null;
  let endDate = null;

  if (range) {
    const now = new Date();

    endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    if (range === "today") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } 
    else if (range === "3days") {
      startDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    } 
    else if (range === "7days") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } 
    else if (range === "30days") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    if (startDate) startDate.setHours(0, 0, 0, 0);
  }

  const result = await orderRepo.fetchAllOrders({
    page: page ? Number(page) : null,
    limit: limit ? Number(limit) : null,
    paymentStatus,
    status: ["CONFIRMED", "CANCELLED"],
    startDate,
    endDate,
  });

  return {
    orders: result.orders,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
  };
};


export const getConfirmedOrdersService = async (range = "today") => {
  const now = new Date();
  let startDate;

  if (range === "today") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else {
    const days = parseInt(range);
    if (!isNaN(days)) {
      startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    }
  }

  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  return await orderRepo.fetchConfirmedOrders(startDate, endDate);
};




const allowedStatuses = [
  "CONFIRMED",
  "PREPARING",
  "DELIVERED",
  "CANCELLED",
];

export const updateOrderStatus = async (userId, status) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user id");
  }

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  const orders = await orderRepo.findPendingOrdersByUser(userId);

  if (!orders.length) {
    throw new Error("No pending orders found for this user");
  }

  const updatedOrders = await orderRepo.updateStatusByUser(userId, status);

  return {
    success: true,
    message: "Orders updated successfully",
    updatedCount: updatedOrders.modifiedCount,
  };
};



export const cancelOrder = async (orderId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order id");
  }

  const order = await orderRepo.findById(orderId);
  if (!order) throw new Error("Order not found");

  if (order.status === "DELIVERED") {
    throw new Error("Delivered orders cannot be cancelled");
  }

  if (order.status === "CANCELLED") {
    throw new Error("Order already cancelled");
  }

  const wallet = await userRepo.getWallet(order.user);
  if (!wallet) throw new Error("Wallet not found");

 if (order.paymentStatus === "PAID"){
    wallet.balance += order.totalAmount;

    await WalletHistory.create({
      user: order.user,
      type: "credit",
      amount: order.totalAmount,
      subtotal: wallet.balance, 
      description: `Refund for cancelled order ${order._id}`,
    });

    await wallet.save();

    await userRepo.updateUserWalletFields(
      order.user,
      wallet.balance,
      wallet.pending
    );
  }

  const updatedOrder = await orderRepo.cancelOrderById(orderId);

  return {
    success: true,
    message: "Order cancelled and amount refunded",
    data: updatedOrder,
  };
};


export const fetchRecentOrders = async () => {
  const orders = await orderRepo.getRecentOrders();

  return orders;
};


export const getOrdersByStatusService = async (status) => {
  const validStatus = ["CANCELLED", "CONFIRMED"];

  if (!validStatus.includes(status)) {
    throw new Error("Invalid status");
  }

  const orders = await orderRepo.getOrdersByStatusRepo(status);

  return orders;
};



export const searchOrdersService = async (query) => {

  if (!query) {
    throw new Error("Search query is required");
  }

  const orders = await orderRepo.searchOrdersRepo(query);

  return orders;
};




export const searchPendingOrdersService = async (range = "today", search = "") => {
  const now = new Date();
  let startDate;

  if (range === "today") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else {
    const days = parseInt(range);
    startDate = !isNaN(days)
      ? new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
      : new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  const startUTC = new Date(startDate);
  startUTC.setHours(0, 0, 0, 0);

  const endUTC = new Date(now);
  endUTC.setHours(23, 59, 59, 999);

  const orders = await orderRepo.searchPendingOrders(startUTC, endUTC, search);

  if (!orders.length) return [];

  const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return [
    {
      orderCount: orders.length,
      totalAmount,
      orders,
    },
  ];
};