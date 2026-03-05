import mongoose from "mongoose";
import Menu from "../ models/menu.model.js"



export const findMenuByCategoryAndDate = (categoryId, date) => {
  return Menu.findOne({
    category: categoryId,
    date: date
  })
    .populate("category", "name")
    .populate("items.food", "name price");
};

export const createMenu = (data) => {
  return Menu.create(data);
};

export const addFoodToMenu = async (menuId, item) => {
  return Menu.findByIdAndUpdate(
    menuId,
    { $push: { items: item } },
    { new: true }
  )
    .populate("category", "name")
    .populate("items.food", "name price");
};



export const getAllMenusRepo = async () => {
  return await Menu.find()
    .populate("category", "name")
    .populate("items.food", "name price");
};



export const getMenuByCategoryName = (categoryName, date) => {
  return Menu.find({ date })
    .populate({
      path: "category",
      match: { name: new RegExp(`^${categoryName}$`, "i") },
      select: "name",
    })
    .populate("items.food", "name price");
};




export const findTodayMenuByFood = async (foodId) => {

  return Menu.findOne({
    "items.food": foodId
  }).populate("category");
};


export const deleteMenuById = (menuId) => {
  return Menu.findByIdAndDelete(menuId);
};






export const removeItemFromMenuRepo = async (
  categoryId,
  foodId
) => {
  return await Menu.findOneAndUpdate(
    {
      category: new mongoose.Types.ObjectId(categoryId),
    },
    {
      $pull: {
        items: {
          food: new mongoose.Types.ObjectId(foodId),
        },
      },
    },
    {
      new: true,
    }
  );
};




export const updateItemInMenuRepo = async (categoryId, foodId, name, price) => {
  return await Menu.findOneAndUpdate(
    {
      category: new mongoose.Types.ObjectId(categoryId),
      "items.food": new mongoose.Types.ObjectId(foodId),
    },
    {
      $set: {
        "items.$.name": name,
        "items.$.price": price,
      },
    },
    { new: true }
  );
};

export const getTodayMenu = async () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return Menu.findOne({
    date: { $gte: start, $lte: end },
  });
};