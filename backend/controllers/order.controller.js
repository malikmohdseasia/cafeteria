
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";
import * as orderService from "../services/order.service.js";
import { generateExcel } from "../utils/excel.helper.js";
import { generatePDF } from "../utils/pdf.helper.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const order = await orderService.createOrderFromCart(userId);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.ORDER_CREATED,
      data: order,
    });
  } catch (error) {
    const status =
      error.message === MESSAGES.CART_EMPTY ||
      error.message === MESSAGES.CART_NOT_FOUND
        ? HTTP_STATUS.BAD_REQUEST
        : HTTP_STATUS.INTERNAL_SERVER_ERROR;

    res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await orderService.getOrdersByUser(userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};




export const getTopUsers = async (req, res) => {
  try {
    const { range = "today" } = req.query;

    const topUsers = await orderService.getTopUsersService(range);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      range,
      data: topUsers,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};




export const getPendingOrders = async (req, res) => {
  try {
    const { range = "today" } = req.query;

    const pendingOrders = await orderService.getPendingOrdersService(range);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      range,
      totalPending: pendingOrders.length,
      data: pendingOrders,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};



export const getMostOrderedTimeSlots = async (req, res) => {
  try {
    const result = await orderService.getMostOrderedTimeSlotsService();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





export const getRevenueStatsController = async (req, res) => {
  try {
    const { range } = req.query;

    const stats = await orderService.getRevenueStatsService(range);

    res.status(200).json({
      success: true,
      range: range || "today",
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




export const getOrderHistory = async (req, res) => {
  try {
    const result = await orderService.getOrderHistoryService(req.query);

    res.status(200).json({
      success: true,
      message: "Order history fetched successfully",
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getConfirmedOrders = async (req, res) => {
  try {
    const { range = "today" } = req.query;

    const confirmedOrders =
      await orderService.getConfirmedOrdersService(range);

    res.status(200).json({
      success: true,
      totalConfirmed: confirmedOrders.length,
      data: confirmedOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const result = await orderService.updateOrderStatus(orderId, status);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await orderService.cancelOrder(orderId);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};















export const downloadPendingOrders = async (req, res) => {
  try {
    const { range = "today", format = "pdf" } = req.query;

    const pendingOrders = await orderService.getPendingOrdersService(range);

    const formattedData = pendingOrders.map(order => ({
      Date: new Date(order.createdAt).toLocaleDateString(),
      OrderId: order._id,
      EmployeeName: order.user?.name,
      EmployeeEmail: order.user?.email,
      Status: order.status,
      TotalAmount: order.totalAmount,
    }));

    let filePath;

    if (format === "excel") {
      filePath = await generateExcel("pending-orders", range, formattedData);
    } else {
      filePath = await generatePDF("pending-orders", range, formattedData);
    }

    return res.download(filePath);

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};




export const downloadOrdersHistory = async (req, res) => {
  try {
    const { range = "today", format = "pdf", page = 1, limit = 1000 } = req.query;

    // ⚠ Pass full query object, not just range
    const result = await orderService.getOrderHistoryService({
      page,
      limit,
      range,
    });

    const orders = result.orders; // ✅ get array properly

    const formattedData = orders.map(order => ({
      Date: new Date(order.createdAt).toLocaleDateString(),
      OrderId: order._id.toString(),
      EmployeeName: order.user?.name || "-",
      EmployeeEmail: order.user?.email || "-",
      Status: order.status,
      TotalAmount: order.totalAmount,
    }));

    let filePath;

    if (format === "excel") {
      filePath = await generateExcel("history-orders", range, formattedData);
    } else {
      filePath = await generatePDF("history-orders", range, formattedData);
    }

    return res.download(filePath);

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getRecentOrdersController = async (req, res) => {
  try {
    const orders = await orderService.fetchRecentOrders();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};