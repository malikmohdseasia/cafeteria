import { HTTP_STATUS } from "../constants/httpStatus.js";
import * as menuService from "../services/menu.service.js";


export const addFoodByCategoryName = async (req, res) => {
  try {
    const { categoryName, foodIds } = req.body;

    const menu = await menuService.addFoodUsingCategoryName(
      categoryName,
      foodIds
    );

    const formatted = {
      categoryName: menu.category?.name,
      items: menu.items.map((i) => ({
        id: i.food?._id || i.food,   // 👈 FIX
        name: i.food?.name || "",
        price: i.food?.price || 0,
      })),
    };

    res.status(200).json({
      success: true,
      data: formatted,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllMenusController = async (req, res) => {
  try {
    const data = await menuService.getAllMenusService();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getMenuByCategory = async (req, res) => {
  const { categoryName } = req.params;

  const menu = await menuService.getMenuByCategoryName(categoryName);

  const filtered = menu
    .filter((m) => m.category) // VERY IMPORTANT
    .map((m) => ({
      categoryId: m.category._id,
      categoryName: m.category.name,
      items: m.items.map((i) => ({
        id: i.food._id,
        name: i.food.name,
        price: i.food.price,
      })),
    }));

  res.status(200).json({
    success: true,
    data: filtered,
  });
};



export const deleteMenu = async (req, res) => {
  try {
    const { menuId } = req.params;

    const result = await menuService.deleteMenuById(menuId);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



export const removeItemFromMenuController = async (
  req,
  res
) => {
  try {
    const { categoryId, foodId } = req.body;

    const updatedMenu = await menuService.removeItemFromMenuService(
      categoryId,
      foodId
    );

    return res.status(200).json({
      success: true,
      message: "Item removed successfully",
      data: updatedMenu,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const updateItemInMenuController = async (req, res) => {
  try {
    const { categoryId, foodId, name, price } = req.body;

    if (!categoryId || !foodId || !name || price == null)
      return res.status(400).json({ success: false, message: "Invalid data" });

    const updatedMenu = await menuService.updateItemInMenuService(
      categoryId,
      foodId,
      name,
      price
    );

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: updatedMenu,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};