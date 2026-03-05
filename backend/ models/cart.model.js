import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  items: [
    {
      food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
      },

      foodName: {                
        type: String,
        required: true,
      },

      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },

      categoryName: {
        type: String,
        required: true,
      },

      quantity: {
        type: Number,
        default: 1,
      },

      addedAt: {                
        type: Date,
        default: Date.now,
      },
    },
  ],
},
{ timestamps: true }
);

export default mongoose.model("Cart", cartSchema);