import express from "express";
import { roleGuard } from "../middlewares/role.guard.js";
import { authGuard } from "../middlewares/auth.guard.js";
import { getNotificationsController, markNotificationsRead } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", authGuard, roleGuard("ADMIN"), getNotificationsController);
router.patch("/read", authGuard, roleGuard("ADMIN"), markNotificationsRead);


export default router;