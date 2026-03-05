import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    name: { type: String },   // menu-specific override
    price: { type: Number },  // menu-specific override
  },
  { _id: false }
);

const menuSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    items: [menuItemSchema],
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Menu", menuSchema);