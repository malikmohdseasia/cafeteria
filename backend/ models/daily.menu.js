import mongoose from "mongoose";

const dailyMenuItemSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    foodName: { type: String, required: true },  
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 }, 
  },
  { _id: false }
);

const dailyMenuSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true },
    items: [dailyMenuItemSchema],
  },
  { timestamps: true }
);

export const DailyMenu = mongoose.model("DailyMenu", dailyMenuSchema);