import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";
import * as categoryService from "../services/category.service.js";


export const create = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body.name);
    res.status(HTTP_STATUS.CREATED).json({ success: true, category });
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: err.message });
  }
};

export const update = async (req, res) => {
  const category = await categoryService.updateCategory(
    req.params.id,
    req.body.name
  );
  res.status(HTTP_STATUS.OK).json(category);
};

export const remove = async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  res.status(HTTP_STATUS.OK).json({ message: MESSAGES.CATEGORY.CATEGORY_DELETED});
};




export const getAllWithProducts = async (req, res, next) => {
  try {
    const data = await categoryService.getAllCategoriesWithProducts();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};


export const getCategories = async(req, res, next)=>{
  try {
    const data = await categoryService.getAllCategories();

    res.status(HTTP_STATUS.OK).json({
      success:true,
      data
    })
  } catch (error) {
    next(err)
  }
}