import * as authService from "../services/auth.service.js";
import * as userRepo from "../repositories/user.repository.js";
import { MESSAGES } from "../constants/messages.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";


export const registerUser = async (req, res, next) => {
  try {
    const { name, email} = req.body;

    const user = await authService.registerUser(name, email);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};


export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    await authService.sendOtp(email);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const token = await authService.verifyOtp(email, otp);

    const user = await userRepo.findByEmail(email);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.AUTH.LOGIN_SUCCESS,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};


export const getUsersWithPendingPayment = async (req, res) => {
  try {
    const result = await authService.getUsersWithPendingPayment();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getAllUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};