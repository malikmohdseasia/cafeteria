import * as dailyMenuRepo from "../repositories/daily.menu.repositry.js";
import * as menuRepo from "../repositories/menu.repositry.js";

export const addToDailyMenu = async (categoryId, foodId) => {
  return dailyMenuRepo.addItemToDailyMenu(categoryId, foodId);
};

// export const getDailyMenu = async (req, res) => {
//   try {
//     const dailyMenu = await dailyMenuRepo.getLatestDailyMenuWithNames();

//     if (!dailyMenu) return res.status(404).json({ success: false, message: "No daily menu found" });

//     const formatted = dailyMenu.items.map((i) => ({
//       categoryId: i.category._id,
//       categoryName: i.category.name,
//       foodId: i.food._id,
//       foodName: i.food.name,
//       price: i.price,
//       quantity: i.quantity,
//     }));

//     res.status(200).json({ success: true, data: formatted });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


export const resetMenuItemsDaily = async () => {
  await dailyMenuRepo.clearMenuItems();
};

export const deleteDailyMenuItem = async (foodId) => {
  const updatedMenu = await dailyMenuRepo.removeItemByFoodId(foodId);

  if (!updatedMenu) {
    throw new Error("Item not found in daily menu");
  }

  return updatedMenu;
};




export const getDailyMenu = async () => {
  const dailyMenu = await dailyMenuRepo.getLatestDailyMenu();

  if (!dailyMenu) {
    throw new Error("No daily menu found");
  }

  const todayMenu = await menuRepo.getTodayMenu();

  // 🔥 Convert menu items into Map for fast lookup
  const menuMap = new Map();

  if (todayMenu) {
    todayMenu.items.forEach((item) => {
      menuMap.set(item.food.toString(), item);
    });
  }

  // 🔥 Format response
  const formatted = dailyMenu.items.map((dItem) => {
    const overrideItem = menuMap.get(
      dItem.food._id.toString()
    );

    return {
      categoryId: dItem.category._id,
      categoryName: dItem.category.name,
      foodId: dItem.food._id,
      foodName: overrideItem?.name || dItem.food.name,
      price: overrideItem?.price || dItem.food.price,
      quantity: dItem.quantity,
    };
  });

  return formatted;
};