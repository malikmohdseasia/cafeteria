import { HTTP_STATUS } from "../constants/httpStatus.js";
import * as dailyMenuService from "../services/daily.menu.service.js";
import { MESSAGES } from "../constants/messages.js";



export const addDailyMenuItems = async (req, res) => {
  try {
    const { categoryId, foodId } = req.body;

    if (!categoryId || !foodId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.FOOD.CATE_FOOD,
      });
    }

    const result = await dailyMenuService.addToDailyMenu(
      categoryId,
      foodId
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Item added to Daily Menu",
      data: result,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};


export const getDailyMenu = async (req, res) => {
  try {
    const data =
      await dailyMenuService.getDailyMenu();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: error.message,
    });
  }
};



export const deleteDailyMenuItemController = async (req, res) => {
  try {
    const { foodId } = req.params;

    if (!foodId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "FoodId is required",
      });
    }

    const updatedMenu =
      await dailyMenuService.deleteDailyMenuItem(foodId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Item removed successfully",
      data: updatedMenu,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};