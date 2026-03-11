import { create } from "zustand";
import { fetchDailyMenuApi, addDailyMenuItemApi, deleteItemApiDailyMenu } from "../../../api/menuApi";

interface DailyMenuItem {
  category: string;
  food: string;
  foodName: string;
  price: number;
}

interface DailyMenu {
  _id: string;
  date: string;
  items: DailyMenuItem[];
}

interface DailyMenuState {
  dailyMenu: DailyMenu | null;
  isLoading: boolean;
  error: string | null;

  fetchDailyMenu: () => Promise<void>;
  clearDailyMenu: () => void;
  deleteItemFromDailyMenu: (foodId: string) => Promise<void>;
}

export const useDailyMenuStore = create<DailyMenuState>((set, get) => ({
  dailyMenu: null,
  isLoading: false,
  error: null,

  fetchDailyMenu: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchDailyMenuApi();
      const dailyMenuData = response.data?.data || null;

      set({ dailyMenu: dailyMenuData, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },

  addItemToDailyMenu: async (categoryId: any, foodId: any) => {
    try {
      await addDailyMenuItemApi(categoryId, foodId);
      await get().fetchDailyMenu();
    } catch (err: any) {
      console.error(err);
    }
  },
  deleteItemFromDailyMenu: async (foodId: string) => {
  try {
    await deleteItemApiDailyMenu(foodId);
    await get().fetchDailyMenu(); 
  } catch (err: any) {
    console.error(err);
  }
},

  clearDailyMenu: () => {
    set({ dailyMenu: null });
  },
}));