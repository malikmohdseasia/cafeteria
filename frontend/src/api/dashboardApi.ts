import { axiosInstance } from "./axiosInstance";

export const fetchDailyDashboard =  () => 
  axiosInstance.get(`/dashboard`);