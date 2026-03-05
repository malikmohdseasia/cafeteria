import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";
import { getTopSellingByCategory } from "../repositories/order.repository.js";
import * as cartService from "../services/cart.service.js";



export const addItemToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodId } = req.body;

    const cart = await cartService.addToCart(userId, foodId);

    res.status(201).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};






export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await cartService.getCart(userId);

    res.status(HTTP_STATUS.OK).json(cart);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};



export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodId, quantity } = req.body;

    const cart = await cartService.updateQuantity(userId, foodId, quantity);

    res.status(HTTP_STATUS.OK).json(cart);
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};




export const checkout = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await cartService.checkoutCart(userId);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};





export const adminCheckout = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await cartService.checkoutCartByAdmin(userId);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
