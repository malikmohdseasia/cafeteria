import Cart from "../ models/cart.model.js";
import Food from "../ models/food.model.js";
import User from "../ models/user.model.js";



export const findCartByUserId = (userId) => {
  return Cart.findOne({ user: userId });
};

export const createCart = (userId) => {
  return Cart.create({ user: userId, items: [] });
};

export const saveCart = (cart) => {
  return cart.save();
};




export const findCartWithFood = (userId) => {
  return Cart.findOne({ user: userId }).populate({
    path: "items.food",
    select: "name price category",
    populate: {
      path: "category",
      select: "name",
    },
  });
};




export const findCartByUser = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items.food",
    select: "name price category",
    populate: {
      path: "category",
      select: "name",
    },
  });

  return cart;
};


export const updateCartItemQuantity = async (userId, foodId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  const item = cart.items.find((i) => i.food.toString() === foodId);
  if (!item) throw new Error("Food item not in cart");

  item.quantity = quantity;

  await cart.save();

  const food = await Food.findById(foodId).populate("category");

  return {
    foodId: food._id,
    foodName: food.name,
    categoryName: food.category?.name || "Unknown",
    price: food.price,
    quantity: item.quantity,
    subtotal: food.price * item.quantity,
  };
};




export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  // Prepare summary before clearing
  const itemsWithDetails = await Promise.all(
    cart.items.map(async (item) => {
      const food = await Food.findById(item.food).populate("category");
      if (!food) return null;

      return {
        foodId: food._id,
        foodName: food.name,
        categoryName: food.category?.name || "Unknown",
        price: food.price,
        quantity: item.quantity,
        subtotal: food.price * item.quantity,
      };
    })
  );

  // Clear cart
  cart.items = [];
  await cart.save();

  // Return only valid items
  const items = itemsWithDetails.filter((i) => i !== null);
  const total = items.reduce((acc, i) => acc + i.subtotal, 0);

  return { items, total };
};



export const saveOrderHistory = async (userId, items, total) => {
  return User.findByIdAndUpdate(
    userId,
    {
      $push: {
        orderHistory: {
          items,
          total,
          createdAt: new Date(),
        },
      },
    },
    { new: true }
  );
};