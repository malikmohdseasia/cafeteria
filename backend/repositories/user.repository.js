import User from "../ models/user.model.js";
import Wallet from "../ models/wallet.model.js";

export const findByEmail = (email) =>
  User.findOne({ email });

export const createUser = (data) =>
  User.create(data);

export const findUserById = (userId) => {
  return User.findById(userId);
};

export const saveOtp = (email, otp, expiresAt) =>
  User.findOneAndUpdate(
    { email },
    { otp, otpExpiresAt: expiresAt },
    { new: true }
  );

export const verifyOtp = (email, otp) =>
  User.findOne({
    email,
    otp,
    otpExpiresAt: { $gt: new Date() },
  });

export const markVerified = (userId) =>
  User.findByIdAndUpdate(
    userId,
    {
      isVerified: true,
      otp: null,
      otpExpiresAt: null,
    },
    { new: true }
  );





export const createWalletForUser = async (userId) => {
  return Wallet.create({
    user: userId,
    balance: 0,
    pending: 0,
    history: [],
  });
};

export const addMoneyToWallet = async (userId, amount) => {
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) throw new Error("Wallet not found");

  wallet.balance += amount;

  if (wallet.pending > 0) {
    if (wallet.balance >= wallet.pending) {
      wallet.balance -= wallet.pending;
      wallet.history.push({
        type: "pending",
        amount: wallet.pending,
        description: "Pending bill cleared",
      });
      wallet.pending = 0;
    } else {
      wallet.pending -= wallet.balance;
      wallet.history.push({
        type: "pending",
        amount: wallet.balance,
        description: "Partial pending bill cleared",
      });
      wallet.balance = 0;
    }
  }

  wallet.history.push({ type: "credit", amount, description: "Wallet top-up" });

  return wallet.save();
};

export const getWallet = (userId) => Wallet.findOne({ user: userId });



export const findById = (userId) => User.findById(userId);

export const saveUser = (user) => user.save();



export const updateUserWalletFields = (userId, balance, pending) =>
  User.findByIdAndUpdate(
    userId,
    {
      wallet: balance,
      pending: pending,
    },
    { new: true }
  );


  export const getUsersWithPendingPayment = () =>
  User.find({ pending: { $gt: 0 } })
    .select("-otp -otpExpiresAt")
    .sort({ pending: -1 });