import * as userRepo from "../repositories/user.repository.js";
import { generateToken } from "../utils/jwt.js";
import { ROLES } from "../constants/roles.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";


export const registerUser = async (name, email) => {
  if (!name || !email) {
    throw new Error("Name & email  are required");
  }

  const existingUser = await userRepo.findByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }


  const user = await userRepo.createUser({
    name,
    email,
    role: ROLES.USER,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const sendOtp = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await userRepo.findByEmail(email);

  if (!user) {
    throw new Error("User not found. Please create your account first.");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await userRepo.saveOtp(email, otp, expiresAt);

  await sendEmail(
    email,
    "Your Login OTP",
    `Your OTP is ${otp}. It will expire in 5 minutes.`
  );
};

export const verifyOtp = async (email, otp) => {
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const user = await userRepo.verifyOtp(email, otp);

  if (!user) {
    throw new Error("Invalid or expired OTP");
  }

  if (!user.walletCreated) {
    await userRepo.createWalletForUser(user._id);
    user.walletCreated = true;
    await user.save();
  }

  await userRepo.markVerified(user._id);

  const token = generateToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  return token;
};




export const adminAddMoney = async (userId, amount) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  let remainingAmount = amount;

  if (user.pending > 0) {
    const pendingPaid = Math.min(user.pending, remainingAmount);
    user.pending -= pendingPaid;
    remainingAmount -= pendingPaid;

    user.walletHistory.push({
      type: "pending",
      amount: pendingPaid,
      subtotal: user.wallet,
      description: "Pending bill paid via admin top-up",
    });
  }

  if (remainingAmount > 0) {
    user.wallet += remainingAmount;

    user.walletHistory.push({
      type: "credit",
      amount: remainingAmount,
      subtotal: user.wallet,
      description: "Added by admin",
    });
  }

  const savedUser = await userRepo.saveUser(user);

  return {
    success: true,
    walletBalance: savedUser.wallet,
    pending: savedUser.pending,
    walletHistory: savedUser.walletHistory,
  };
};


export const getUsersWithPendingPayment = async () => {
  const users = await userRepo.getUsersWithPendingPayment();

  return {
    success: true,
    count: users.length,
    data: users,
  };
};




export const getAllUsers = async () => {
  const users = await userRepo.getAllUsers();

  if (!users || users.length === 0) {
    throw new Error("No users found");
  }

  return users;
};