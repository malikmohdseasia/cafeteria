import { DailyMenu } from "../ models/daily.menu.js";
import Food from "../ models/food.model.js";

export const getLatestDailyMenu = async () => {
  return DailyMenu.findOne()
    .sort({ createdAt: -1 })
    .populate("items.category")
    .populate("items.food");
};

export const createDailyMenu = async (date, items) => {
  const menu = new DailyMenu({ date, items });
  return await menu.save();
};


export const addItemToDailyMenu = async (categoryId, foodId) => {
  const food = await Food.findById(foodId);

  if (!food) {
    throw new Error("Food not found");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let dailyMenu = await DailyMenu.findOne({ date: today });

  if (!dailyMenu) {
    dailyMenu = await DailyMenu.create({
      date: today,
      items: [],
    });
  }

  const exists = dailyMenu.items.some(
    (item) =>
      item.food.toString() === foodId &&
      item.category.toString() === categoryId
  );

  if (exists) {
    return dailyMenu; 
  }

  dailyMenu.items.push({
    category: categoryId,
    food: foodId,
    foodName: food.name,
    price: food.price,
    quantity: 1,
  });

  await dailyMenu.save();

  return dailyMenu;
};






export const removeItemByFoodId = async (foodId) => {
  return await DailyMenu.findOneAndUpdate(
    { "items.food": foodId },
    { $pull: { items: { food: foodId } } },
    { new: true }
  );
};

export const clearMenuItems = async () => {
  const result = await DailyMenu.updateMany(
    {},
    { $set: { items: [] } }
  );

  console.log("Modified Count:", result.modifiedCount);
  return result;
};