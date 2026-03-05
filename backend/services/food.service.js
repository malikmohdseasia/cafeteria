import { MESSAGES } from "../constants/messages.js";
import * as foodRepo from "../repositories/food.repository.js";

export const createFood = async (data) => {
  try {
    return await foodRepo.createFood(data);
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Food name already exists");
    }
    throw error;
  }
};

export const getAllFoods = async () => {
  return await foodRepo.findAll();
};

export const getFoodById = async (id) => {
  const food = await foodRepo.findById(id);
  if (!food) {
    const err = new Error(MESSAGES.FOOD.NOT_FOUND);
    err.statusCode = 404;
    throw err;
  }
  return food;
};

export const updateFood = async (id, data) => {
  const food = await foodRepo.updateById(id, data);
  if (!food) {
    const err = new Error(MESSAGES.FOOD.NOT_FOUND);
    err.statusCode = 404;
    throw err;
  }
  return food;
};

export const deleteFood = async (id) => {
  const food = await foodRepo.deleteById(id);
  if (!food) {
    const err = new Error(MESSAGES.FOOD.NOT_FOUND);
    err.statusCode = 404;
    throw err;
  }
  return food;
};