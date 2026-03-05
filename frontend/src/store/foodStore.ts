import { create } from "zustand";
import { fetchFoodApi, createFoodApi } from "../api/foodApi";

interface Food {
  _id: string;
  name: string;
  price: number;
  category: string;
}

interface FoodState {
  foods: Food[];
  isLoading: boolean;
  error: string | null;

  fetchFoods: () => Promise<void>;
  createFood: (name: string, price: number) => Promise<void>;
  clearFoods: () => void;
}

export const useFoodStore = create<FoodState>((set) => ({
  foods: [],
  isLoading: false,
  error: null,

  fetchFoods: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await fetchFoodApi();

      set({
        foods: data?.data || [],
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },

  createFood: async (name, price) => {
    set({ isLoading: true, error: null });

    try {
      const res = await createFoodApi(name, price);
      console.log(res);

      set((state) => ({
        foods: [...state.foods, res.data.data], 
        isLoading: false,
      }));

    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },

  clearFoods: () => {
    set({ foods: [] });
  },
}));