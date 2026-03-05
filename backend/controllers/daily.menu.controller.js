import * as dailyMenuService from "../services/daily.menu.service.js";



export const addDailyMenuItems = async (req, res) => {
  try {
    const { categoryId, foodId } = req.body;

    if (!categoryId || !foodId) {
      return res.status(400).json({
        success: false,
        message: "categoryId and foodId are required",
      });
    }

    const result = await dailyMenuService.addToDailyMenu(
      categoryId,
      foodId
    );

    res.status(200).json({
      success: true,
      message: "Item added to Daily Menu",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getDailyMenu = async (req, res) => {
  try {
    const data =
      await dailyMenuService.getDailyMenu();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};



export const deleteDailyMenuItemController = async (req, res) => {
  try {
    const { foodId } = req.params;

    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: "FoodId is required",
      });
    }

    const updatedMenu =
      await dailyMenuService.deleteDailyMenuItem(foodId);

    res.status(200).json({
      success: true,
      message: "Item removed successfully",
      data: updatedMenu,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};