import express from "express";
import { authGuard } from "../middlewares/auth.guard.js";
import { roleGuard } from "../middlewares/role.guard.js";
import { getAdminDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", authGuard, roleGuard("ADMIN"), getAdminDashboard);

export default router;