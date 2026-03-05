// routes/cart.routes.js
import express from "express";
import {
  addItemToCart,
  adminCheckout,
  checkout,
  getCart,
  updateCartQuantity,
} from "../controllers/cart.controller.js";

import { authGuard } from "../middlewares/auth.guard.js";
import { roleGuard } from "../middlewares/role.guard.js";

const router = express.Router();

router.post("/add", authGuard, roleGuard("USER"), addItemToCart);
router.get("/", authGuard, roleGuard("USER"), getCart)
router.patch("/quantity", authGuard, roleGuard("USER"), updateCartQuantity);



export default router;