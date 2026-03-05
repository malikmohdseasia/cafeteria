import express from "express";
import { exportAnalyticsController, getAnalyticsController } from "../controllers/analytics.controller.js";
import { authGuard } from "../middlewares/auth.guard.js";
import { roleGuard } from "../middlewares/role.guard.js";
import { getMostOrderedTimeSlots } from "../controllers/order.controller.js";
const router = express.Router();

router.get("/export", authGuard, roleGuard("ADMIN"), exportAnalyticsController);
router.get("/admin/most-order-slots", authGuard, roleGuard("ADMIN"), getMostOrderedTimeSlots);
router.get("/:type", authGuard, roleGuard("ADMIN"), getAnalyticsController)

export default router;