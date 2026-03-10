import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";
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
        id: i.food?._id || i.food,   
        name: i.food?.name || "",
        price: i.food?.price || 0,
      })),
    };

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: formatted,
    });

  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllMenusController = async (req, res) => {
  try {
    const data = await menuService.getAllMenusService();
    return res.status(HTTP_STATUS.OK).json({ success: true, data });
  } catch (error) {
    return res.status(HTTP_STATUS.in).json({ success: false, message: error.message });
  }
};


export const getMenuByCategory = async (req, res) => {
  const { categoryName } = req.params;

  const menu = await menuService.getMenuByCategoryName(categoryName);

  const filtered = menu
    .filter((m) => m.category)
    .map((m) => ({
      categoryId: m.category._id,
      categoryName: m.category.name,
      items: m.items.map((i) => ({
        id: i.food._id,
        name: i.food.name,
        price: i.food.price,
      })),
    }));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: filtered,
  });
};



export const deleteMenu = async (req, res) => {
  try {
    const { menuId } = req.params;

    const result = await menuService.deleteMenuById(menuId);

    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
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

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Item removed successfully",
      data: updatedMenu,
    });
  } catch (error) {
    return res.status(HTTP_STATUS.OK).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const updateItemInMenuController = async (req, res) => {
  try {
    const { categoryId, foodId, name, price } = req.body;

    if (!categoryId || !foodId || !name || price == null)
      return res.status(HTTP_STATUS.OK).json({ success: false, message: "Invalid data" });

    const updatedMenu = await menuService.updateItemInMenuService(
      categoryId,
      foodId,
      name,
      price
    );

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.FOOD.UPDATE,
      data: updatedMenu,
    });
  } catch (error) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};