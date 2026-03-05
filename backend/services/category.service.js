import * as categoryRepo from "../repositories/category.repositry.js";

const ALLOWED_CATEGORIES = ["breakfast", "lunch", "snacks"];

const generateSlug = (name) => {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
};

export const createCategory = async (name) => {
  if (!name) throw new Error("Category name is required");

  name = name.toLowerCase().trim();

  if (!ALLOWED_CATEGORIES.includes(name)) {
    throw new Error("Invalid category name");
  }

  const exists = await categoryRepo.findCategoryByName(name);
  if (exists) throw new Error("Category already exists");

  const slug = generateSlug(name);

  return categoryRepo.createCategory({ name, slug });
};


export const updateCategory = async (id, name) => {
  if (!name) {
    throw new Error("Category name is required");
  }

  name = name.toLowerCase().trim();

  if (!ALLOWED_CATEGORIES.includes(name)) {
    throw new Error("Invalid category name");
  }

  const category = await categoryRepo.findCategoryById(id);
  if (!category) {
    throw new Error("Category not found");
  }

  return categoryRepo.updateCategoryById(id, { name });
};


export const deleteCategory = async (id) => {
  const category = await categoryRepo.findCategoryById(id);

  if (!category) {
    throw new Error("Category not found");
  }

  return categoryRepo.deleteCategoryById(id);
};

export const getAllCategoriesWithProducts = async () => {
  return categoryRepo.getCategoriesWithProducts();
};

export const getAllCategories = async()=>{
  return categoryRepo.getCategories();
}