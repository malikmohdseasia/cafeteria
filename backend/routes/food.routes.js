import express from "express";
import {
  createFood,
  getFoods,
  getFood,
  updateFood,
  deleteFood,
  searchFoodByNameController,
} from "../controllers/food.controller.js";

import { authGuard } from "../middlewares/auth.guard.js";
import { roleGuard } from "../middlewares/role.guard.js";

const router = express.Router();

router.post("/create", authGuard, roleGuard("ADMIN"), createFood);
router.get("/", authGuard, roleGuard("ADMIN"), getFoods);
router.get("/search", authGuard, roleGuard("ADMIN"), searchFoodByNameController);
router.get("/:id", authGuard, roleGuard("ADMIN"), getFood);
router.patch("/update/:id", authGuard, roleGuard("ADMIN"), updateFood);
router.delete("/:id", authGuard, roleGuard("ADMIN"), deleteFood);
export default router;