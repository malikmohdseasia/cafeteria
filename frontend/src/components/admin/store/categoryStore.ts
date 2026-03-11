import { create } from "zustand";
import { getAllCategoriesApi } from "../../../api/categoryApi";


interface CategoryState {
  categories: [] | null;
  isLoading: boolean;
  error: string | null;

  fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: null,
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await getAllCategoriesApi();
      console.log(response)
      set({
        categories: response.data.data,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },

 
}));