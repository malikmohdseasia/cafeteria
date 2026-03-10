import * as authService from "../services/auth.service.js";
import * as userRepo from "../repositories/user.repository.js";
import { MESSAGES } from "../constants/messages.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { generatePDF } from "../utils/pdf.helper.js";
import { generateExcel } from "../utils/excel.helper.js";


export const registerUser = async (req, res, next) => {
  try {
    const { name, email} = req.body;

    const user = await authService.registerUser(name, email);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.AUTH.REGISTER_SUCCESS,
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

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.OTP.SEND_OTP,
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
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};



export const getAllUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};


export const searchUsersPendingPaymentController = async (req, res) => {
  try {
    const { query } = req.query; 
    if (!query) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.QUERY.QUERY_MESSAGE,
      });
    }

    const result = await authService.searchUsersWithPendingPayment(query);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

export const downloadPendingUsers = async (req, res) => {
  try {
    const { format = "pdf" } = req.query;

    const users = await authService.getUsersWithPendingPayment();

    if (!users || users.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No pending users available",
      });
    }

    const formattedData = users.data.map((user) => ({
      "Employee Id": user.email,
      Name: user.name,
      "Pending Bill": user.pending,
      Wallet: user.wallet || 0,
    }));

    let filePath;

    if (format === "excel") {
      filePath = await generateExcel("pending-users", "all", formattedData);
    } else {
      filePath = await generatePDF("pending-users", "all", formattedData);
    }

    return res.download(filePath);

  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};