import Food from "../ models/food.model.js";

export const createFood = (data) => Food.create(data);

export const findAll = (filter = {}) => Food.find(filter);

export const findById = (id) => Food.findById(id);

export const updateById = (id, data) =>
  Food.findByIdAndUpdate(id, data, { new: true });

export const deleteById = (id) =>
  Food.findByIdAndDelete(id);