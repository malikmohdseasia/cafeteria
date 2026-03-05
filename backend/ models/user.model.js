import mongoose from "mongoose";
import { ROLES } from "../constants/roles.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    otp: String,
    otpExpiresAt: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },

    wallet: {
      type: Number,
      default: 0,
    },

    pending: {
      type: Number,
      default: 0,
    },

    walletCreated: {
      type: Boolean,
      default: false,
    },

    walletHistory: [
      {
        type: {
          type: String,
          enum: ["credit", "debit", "pending"],
        },
        amount: Number,
        subtotal: Number,
        description: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);