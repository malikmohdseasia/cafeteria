import Food from "../ models/food.model.js";
import * as cartRepo from "../repositories/cart.repositry.js";
import * as menuRepo from "../repositories/menu.repositry.js";
import mongoose from "mongoose";

import * as userRepo from "../repositories/user.repository.js";
import * as walletHistoryRepo from "../repositories/wallet.history.repositry.js";
import * as orderRepo from "../repositories/order.repository.js";
import userModel from "../ models/user.model.js";



const isWithinTimeWindow = (categoryName) => {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();

  const windows = {
    breakfast: [8 * 60, 23 * 60],
    lunch: [13 * 60, 14 * 60],
    snacks: [16 * 60, 18 * 60],
  };

  const window = windows[categoryName?.toLowerCase()];
  if (!window) return false;

  return minutes >= window[0] && minutes <= window[1];
};


export const addToCart = async (userId, foodId) => {
  if (!mongoose.Types.ObjectId.isValid(foodId)) {
    throw new Error("Invalid food id");
  }

  const food = await Food.findById(foodId).populate("category");
  if (!food) throw new Error("Food not found");

  const menu = await menuRepo.findTodayMenuByFood(foodId);

  const categoryName = food.category?.name || menu.category.name;

  if (!isWithinTimeWindow(categoryName)) {
    throw new Error(`You cannot order ${categoryName} items right now`);
  }

  let cart = await cartRepo.findCartByUserId(userId);
  if (!cart) cart = await cartRepo.createCart(userId);

  const exists = cart.items.find(item => item.food.toString() === foodId);
  if (exists) throw new Error("Item already in cart");
  cart.items.push({
    food: foodId,
    foodName: food.name,         
    quantity: 1,
    addedAt: new Date(),
    category: food.category?._id,
    categoryName: categoryName,
  });

  return cartRepo.saveCart(cart);
};

export const getCart = async (userId) => {
  const cart = await cartRepo.findCartByUser(userId);

  if (!cart || cart.items.length === 0) {
    return {
      success: true,
      total: 0,
      items: [],
    };
  }

  const items = cart.items.map((item) => ({
    id: item.food._id,
    name: item.food.name,
    price: item.food.price,
    subtotal: item.food.price * item.quantity, 
  }));

  const total = items.reduce(
    (acc, item) => acc + item.subtotal,
    0
  );

  return {
    success: true,
    total,
    items,
  };
};

export const updateQuantity = async (userId, foodId, quantity) => {
  if (!quantity || quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  await cartRepo.updateCartItemQuantity(userId, foodId, quantity);

  const cart = await cartRepo.findCartByUser(userId);

  if (!cart) {
    throw new Error("Cart not found");
  }

  const items = cart.items.map(i => ({
    _id: i.food._id,
    name: i.food.name,
    price: i.food.price
  }));

  return {
    success: true,
    items
  };
};




const MAX_PENDING_LIMIT = 500;

export const checkoutCart = async (userId) => {
  const cart = await cartRepo.findCartByUser(userId);
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const wallet = await userRepo.getWallet(userId);
  if (!wallet) throw new Error("Wallet not found");

  let total = 0;

  const orderItems = cart.items.map(item => {
    if (!item.food) throw new Error("Food item not found in cart");

    total += item.food.price * item.quantity;

    return {
      product: item.food._id,
      foodName: item.foodName || item.food.name,
      categoryName: item.categoryName || item.food.category?.name || "Uncategorized",
      quantity: item.quantity,
      price: item.food.price,
    };
  });

  if (wallet.pending + (total - wallet.balance) > MAX_PENDING_LIMIT) {
    throw new Error(
      `Checkout blocked. Your new pending amount ₹${wallet.pending + (total - wallet.balance)} exceeds limit ₹${MAX_PENDING_LIMIT}. Please clear dues.`
    );
  }

  let paymentStatus = "PAID";
  if (wallet.balance >= total) {
    wallet.balance -= total;

    await walletHistoryRepo.createHistory({
      user: userId,
      type: "debit",
      amount: total,
      subtotal: wallet.balance,
      description: "Order payment",
    });
  } else {
    paymentStatus = "PENDING";

    if (wallet.balance > 0) {
      await walletHistoryRepo.createHistory({
        user: userId,
        type: "debit",
        amount: wallet.balance,
        subtotal: 0,
        description: "Partial order payment",
      });
    }

    const remaining = total - wallet.balance;
    wallet.pending += remaining;
    wallet.balance = 0;

    await walletHistoryRepo.createHistory({
      user: userId,
      type: "pending",
      amount: remaining,
      subtotal: 0,
      description: "Pending bill added",
    });
  }

  const order = await orderRepo.createOrder({
  user: userId,
  items: orderItems,
  totalAmount: total,
  paymentStatus,
  status: "PENDING", 
});

cart.items = [];
await cartRepo.saveCart(cart);

await wallet.save();

await userRepo.updateUserWalletFields(
  userId,
  wallet.balance,
  wallet.pending
);

return {
  success: true,
  message: "Checkout complete",
  data: {
    orderId: order._id,
    total,
    paymentStatus,
    walletBalance: wallet.balance,
    pending: wallet.pending,
  },
};
};


export const checkoutCartByAdmin = async (userId) => {
  const cart = await cartRepo.findCartByUser(userId);
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const wallet = await userRepo.getWallet(userId);
  if (!wallet) {
    throw new Error("Wallet not found");
  }

  let total = 0;

  const orderItems = cart.items.map(item => {
  if (!item.food) throw new Error("Food item not found in cart");

  total += item.food.price * item.quantity;

  return {
    product: item.food._id,
    food: item.food.name,
    category: item.category || item.food.category?._id || null,
    categoryName: item.categoryName || item.food.category?.name || "Uncategorized",
    quantity: item.quantity,
    price: item.food.price,
  };
});

  let paymentStatus = "PAID";

  const usableBalance = wallet.pending > 0 ? 0 : wallet.balance;

  if (usableBalance >= total) {
    wallet.balance -= total;

    await walletHistoryRepo.createHistory({
      user: userId,
      type: "debit",
      amount: total,
      subtotal: wallet.balance,
      description: "Admin checkout - full payment",
    });
  } else {
    paymentStatus = "PENDING";

    if (usableBalance > 0) {
      wallet.balance -= usableBalance;

      await walletHistoryRepo.createHistory({
        user: userId,
        type: "debit",
        amount: usableBalance,
        subtotal: wallet.balance,
        description: "Admin checkout - partial payment",
      });
    }

    const remaining = total - usableBalance;
    wallet.pending += remaining;

    await walletHistoryRepo.createHistory({
      user: userId,
      type: "pending",
      amount: remaining,
      subtotal: wallet.balance,
      description: "Admin checkout - added to pending",
    });
  }

  const order = await orderRepo.createOrder({
    user: userId,
    items: orderItems,
    totalAmount: total,
    paymentStatus,
    status: "PLACED",
  });

  cart.items = [];
  await cartRepo.saveCart(cart);
  await wallet.save();

  return {
    success: true,
    message: "Checkout complete (admin controlled)",
    data: {
      orderId: order._id,
      total,
      paymentStatus,
      walletBalance: wallet.balance,
      pending: wallet.pending,
    },
  };
};