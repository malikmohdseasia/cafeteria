import express from "express";
import {cancelOrderController, downloadOrdersHistory, downloadPendingOrders, getConfirmedOrders, getOrderHistory, getOrdersByStatusController, getPendingOrders, getRecentOrdersController, searchOrdersController, searchPendingOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { authGuard } from "../middlewares/auth.guard.js";
import { roleGuard } from "../middlewares/role.guard.js";
import { adminCheckout, checkout } from "../controllers/cart.controller.js";

const router = express.Router();
router.get("/confirmed", authGuard, roleGuard("ADMIN"), getConfirmedOrders);
router.get("/pending", authGuard, roleGuard("ADMIN"), getPendingOrders);
router.get("/pending/download", authGuard, roleGuard("ADMIN"), downloadPendingOrders);
router.get("/history/download", authGuard, roleGuard("ADMIN"), downloadOrdersHistory);
router.get("/history", authGuard, roleGuard("ADMIN"), getOrderHistory);
router.post("/checkout", authGuard,  checkout);
router.post("/admin/checkout/:userId", authGuard, roleGuard("ADMIN"), adminCheckout);
router.patch("/:userId/status", authGuard, roleGuard("ADMIN"), updateOrderStatus );
router.patch("/:orderId/cancel", authGuard, roleGuard("ADMIN"), cancelOrderController);
router.get("/recent", authGuard, roleGuard("ADMIN"), getRecentOrdersController);
router.get("/status", authGuard, roleGuard("ADMIN"), getOrdersByStatusController);
router.get("/search", authGuard, roleGuard("ADMIN"), searchOrdersController);
router.get("/pending/search", authGuard, roleGuard("ADMIN"), searchPendingOrders);



export default router;