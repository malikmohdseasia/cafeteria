import * as foodService from "../services/food.service.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";

export const createFood = async (req, res, next) => {
  try {
    const { name, price } = req.body;

    const food = await foodService.createFood({ name, price });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.FOOD.CREATED,
      data: food,
    });
  } catch (err) {
    next(err);
  }
};

export const getFoods = async (req, res, next) => {
  try {
    const foods = await foodService.getAllFoods();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (err) {
    next(err);
  }
};

export const getFood = async (req, res, next) => {
  try {
    const food = await foodService.getFoodById(req.params.id);

    res.json({
      success: true,
      data: food,
    });
  } catch (err) {
    next(err);
  }
};

export const updateFood = async (req, res, next) => {
  try {
    const food = await foodService.updateFood(
      req.params.id,
      req.body
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.FOOD.UPDATE,
      data: food,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteFood = async (req, res, next) => {
  try {
    await foodService.deleteFood(req.params.id);

    res.json({
      success: true,
      message: MESSAGES.FOOD.DELETE,
    });
  } catch (err) {
    next(err);
  }
};



export const searchFoodByNameController = async (req, res) => {
  try {
    const { name } = req.query;

    const foods = await foodService.searchFoodByNameService(name);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: foods,
    });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};