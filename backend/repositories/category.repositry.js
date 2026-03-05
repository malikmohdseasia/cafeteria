import Category from "../ models/category.model.js";



export const createCategory = (data) => {
  return Category.create(data);
};

export const updateCategoryById = (id, data) => {
  return Category.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCategoryById = (id) => {
  return Category.findByIdAndDelete(id);
};

export const findCategoryById = (id) => {
  return Category.findById(id);
};

export const findCategoryByName = (name) => {
  return Category.findOne({ name: name.toLowerCase().trim() });
};


export const getCategoriesWithProducts = () => {
  return Category.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "category",
        as: "products",
      },
    },
    {
      $project: {
        name: 1,
        products: {
          $filter: {
            input: "$products",
            as: "product",
            cond: { $eq: ["$$product.isVisible", true] },
          },
        },
      },
    },
  ]);
};



export const getCategories = () => {
  return Category.find();
}