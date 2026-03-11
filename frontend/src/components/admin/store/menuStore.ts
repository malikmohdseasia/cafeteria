import { create } from "zustand";
import { addFoodWithCategoryApi, deleteItemApi, fetchMenuApi, updateFoodInMenuApi } from "../../../api/menuApi";

interface MenuItem {
  id: string;
  name: string;
  price: number;
}

interface MenuCategory {
  categoryId: string;
  categoryName: string;
  items: MenuItem[];
}

interface MenuState {
  menu: MenuCategory[];
  isLoading: boolean;
  error: string | null;

  fetchMenu: () => Promise<void>;
  addFoodWithCategory: (categoryName: string, foodIds: string[]) => Promise<void>;
  deleteItem: (categoryId: string, foodId: string) => Promise<void>;
  updateItem: (categoryId: string, foodId: string, name: string, price: number) => Promise<void>;
  clearMenu: () => void;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  menu: [],
  isLoading: false,
  error: null,

  fetchMenu: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchMenuApi();
      set({ menu: response.data || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
    }
  },

  addFoodWithCategory: async (categoryName: string, foodIds: string[]) => {
    try {
      await addFoodWithCategoryApi({ categoryName, foodIds });
      await get().fetchMenu();
    } catch (error: any) {
      console.error(error.response?.data?.message || error.message);
    }
  },

  deleteItem: async (categoryId, foodId) => {
    try {
      await deleteItemApi(categoryId, foodId);
      await get().fetchMenu();
    } catch (error: any) {
      console.error(error.response?.data?.message);
    }
  },

  updateItem: async (categoryId, foodId, name, price) => {
    try {
      await updateFoodInMenuApi(categoryId, foodId, name, price);
      await get().fetchMenu();
    } catch (error: any) {
      console.error(error.response?.data?.message || error.message);
    }
  },

  clearMenu: () => set({ menu: [] }),
}));