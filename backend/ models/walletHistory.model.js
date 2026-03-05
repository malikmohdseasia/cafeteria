import mongoose from "mongoose";

const walletHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["credit", "debit", "pending"],
      required: true,
    },
    amount: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("WalletHistory", walletHistorySchema);