import express from "express";
import { create, update, remove, getAllWithProducts, getCategories } from "../controllers/category.controller.js";
import { authGuard } from "../middlewares/auth.guard.js";
import {roleGuard} from "../middlewares/role.guard.js";

const router = express.Router();

router.get("/", authGuard, roleGuard("ADMIN"), getCategories);
// router.post("/", authGuard, roleGuard("ADMIN"), create);
router.put("/:id", authGuard, roleGuard("ADMIN"), update);
router.delete("/:id", authGuard, roleGuard("ADMIN"), remove);
router.get("/categories-with-products", authGuard, getAllWithProducts);

export default router;