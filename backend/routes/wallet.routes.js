import express from "express";
import { authGuard } from "../middlewares/auth.guard.js";
import { roleGuard } from "../middlewares/role.guard.js";
import { addMoneyToUser } from "../controllers/admin.controller.js";
import * as walletController from "../controllers/wallet.controller.js"

const router = express.Router();

router.post("/add-money", authGuard, roleGuard("ADMIN"), addMoneyToUser);
// router.get("/:userId", authGuard, roleGuard("USER"), walletController.getWallet);
// router.get("/history/:userId", authGuard, roleGuard("USER"), walletController.getWalletHistory);
router.get("/wallet-history", authGuard, roleGuard("ADMIN"), walletController.getWalletHistory);

export default router;