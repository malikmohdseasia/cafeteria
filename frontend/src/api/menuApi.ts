import { axiosInstance } from "./axiosInstance";

export const fetchMenuApi = () =>
  axiosInstance.get("menu/today").then(res => res.data);


export const fetchDailyMenuApi = () =>
  axiosInstance.get(`menu/daily-menu/get`);


export const addDailyMenuItemApi = (categoryId: string, foodId: string) =>
  axiosInstance.post("/menu/daily-menu", {
    categoryId,
    foodId,
  });


export const addFoodWithCategoryApi = (data: {
  categoryName: string;
  foodIds: string[];
}) =>
  axiosInstance
    .post("/menu/add/foodwithcategory", data)
    .then((res) => res.data);

export const deleteItemApi = (
  categoryId: string,
  foodId: string
) =>
  axiosInstance.delete("/menu/delete", {
    data: { categoryId, foodId },
  });


export const updateFoodInMenuApi = (categoryId: string, foodId: string, name: string, price: number) =>
  axiosInstance.patch("/menu/update-food", { categoryId, foodId, name, price });

export const deleteItemApiDailyMenu = (foodId: string) =>
  axiosInstance.delete(`/menu/delete-item/${foodId}`);