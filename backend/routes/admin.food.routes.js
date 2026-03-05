import express from "express";
import { createFood } from "../controllers/admin.food.controller.js";
import { authMiddleware } from "../middlewares/auth.guard.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

router.post(
  "/food",
  authMiddleware,
  ROLES(ROLES.ADMIN),
  createFood
);

export default router;