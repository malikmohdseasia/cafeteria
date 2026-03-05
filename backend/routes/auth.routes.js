import express from "express";
import { getUsersWithPendingPayment, registerUser, sendOtp, verifyOtp } from "../controllers/auth.controller.js";
import { roleGuard } from "../middlewares/role.guard.js";
import { authGuard } from "../middlewares/auth.guard.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);


router.get("/pending-users", authGuard, roleGuard("ADMIN"), getUsersWithPendingPayment);


export default router;