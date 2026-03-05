import { axiosInstance } from "./axiosInstance";

export const fetchFoodApi = () =>
  axiosInstance.get("food").then(res => res.data);

export const createFoodApi = (name: string, price: number) =>
  axiosInstance.post("food/create", { name, price });