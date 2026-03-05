import express from "express";
import * as menuController from "../controllers/menu.controller.js";
import { authGuard } from "../middlewares/auth.guard.js";
import { roleGuard } from "../middlewares/role.guard.js";
import { addDailyMenuItems, deleteDailyMenuItemController, getDailyMenu } from "../controllers/daily.menu.controller.js";

const router = express.Router();

router.post("/add/foodwithcategory", authGuard, roleGuard("ADMIN"), menuController.addFoodByCategoryName);

router.get("/today", authGuard, menuController.getAllMenusController);

router.get("/:categoryName", menuController.getMenuByCategory);
// router.delete("/delete/:id", authGuard, roleGuard("ADMIN"), menuController.deleteMenu);
router.delete("/delete", authGuard, roleGuard("ADMIN"), menuController.removeItemFromMenuController);
router.patch("/update-food", authGuard, roleGuard("ADMIN"), menuController.updateItemInMenuController);



//daily menu
router.post("/daily-menu",authGuard, roleGuard("ADMIN"), addDailyMenuItems);
router.get("/daily-menu/get", authGuard, roleGuard("ADMIN"), getDailyMenu);
router.delete("/delete-item/:foodId", authGuard, roleGuard("ADMIN"), deleteDailyMenuItemController);


export default router;