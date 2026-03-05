import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },

        foodName: {
          type: String,
          required: true,   
        },

        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: false,
        },

        categoryName: {
          type: String,
          required: true,
        },

        quantity: Number,
        price: Number,
      },
    ],

    totalAmount: { type: Number, required: true },

    paymentStatus: {
      type: String,
      enum: ["PAID", "PENDING"],
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "PREPARING", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);