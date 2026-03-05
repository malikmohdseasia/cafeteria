import * as menuRepo from "../repositories/menu.repositry.js";
import Category from "../ models/category.model.js";
import Menu from "../ models/menu.model.js";


const todayDate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getMenuByCategoryName = async (categoryName) => {
  const today = todayDate();

  return menuRepo.getMenuByCategoryName(categoryName, today);
};



export const addFoodUsingCategoryName = async (categoryName, foodIds) => {
  const category = await Category.findOne({
    name: new RegExp(`^${categoryName}$`, "i"),
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const today = todayDate();

  let menu = await menuRepo.findMenuByCategoryAndDate(
    category._id,
    today
  );

  // create menu if not exist
  if (!menu) {
    const items = foodIds.map((id) => ({ food: id }));

    menu = await menuRepo.createMenu({
      category: category._id,
      items,
      date: today,
    });
  } else {
    const existingFoodIds = menu.items
      .filter((i) => i.food)
      .map((i) => i.food.toString());

    const newFoods = foodIds.filter(
      (id) => !existingFoodIds.includes(id)
    );

    if (newFoods.length === 0) {
      throw new Error("All foods already exist in menu");
    }

    const itemsToAdd = newFoods.map((id) => ({ food: id }));

    menu = await Menu.findByIdAndUpdate(
      menu._id,
      { $push: { items: { $each: itemsToAdd } } },
      { new: true }
    );
  }

  return await Menu.findById(menu._id)
    .populate("category", "name")
    .populate("items.food", "name price");
};

export const getAllMenusService = async () => {
  const menus = await menuRepo.getAllMenusRepo();

  return menus.map((menu) => ({
    _id: menu._id,
    categoryId: menu.category?._id || null,
    categoryName: menu.category?.name || "Unknown",
    items: menu.items.map((item) => ({
      id: item.food?._id || null,
      name: item.name || item.food?.name,
      price: item.price != null ? item.price : item.food?.price,
    })),
    date: menu.date,
  }));
};


export const deleteMenuById = async (menuId) => {
  if (!mongoose.Types.ObjectId.isValid(menuId)) {
    throw new Error("Invalid menu id");
  }

  const deletedMenu = await menuRepo.deleteMenuById(menuId);

  if (!deletedMenu) {
    throw new Error("Menu not found");
  }

  return {
    success: true,
    message: "Menu deleted successfully",
    data: deletedMenu,
  };
};




// menu.service.ts


export const removeItemFromMenuService = async (
  categoryId,
  foodId,
) => {
  const updatedMenu = await menuRepo.removeItemFromMenuRepo(
    categoryId,
    foodId
  );

  if (!updatedMenu) {
    throw new Error("Menu not found");
  }

  return updatedMenu;
};



export const updateItemInMenuService = async (categoryId, foodId, name, price) => {
  const updatedMenu = await menuRepo.updateItemInMenuRepo(categoryId, foodId, name, price);
  if (!updatedMenu) throw new Error("Menu or item not found");
  return updatedMenu;
};