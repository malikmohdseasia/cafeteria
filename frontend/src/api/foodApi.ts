import { axiosInstance } from "./axiosInstance";

export const fetchFoodApi = () =>
  axiosInstance.get("food").then(res => res.data);

export const createFoodApi = (name: string, price: number) =>
  axiosInstance.post("food/create", { name, price });

export const deleteFoodApi = (id:string)=>
  axiosInstance.delete(`food/${id}`)

export const UpdateFoodApi = (
  id: string,
  data: { name: string; price: number }
) => axiosInstance.patch(`food/update/${id}`, data);

export const searchFoodApi = (name: string) =>
  axiosInstance.get(`food/search?name=${name}`).then(res => res.data);