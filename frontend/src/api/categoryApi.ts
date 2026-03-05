import { axiosInstance } from "./axiosInstance"

export const getAllCategoriesApi = ()=>
    axiosInstance.get("/category")