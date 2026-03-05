import { HTTP_STATUS } from "../constants/httpStatus.js";
import * as adminService from "../services/admin.service.js";

export const addMoneyToUser = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const result = await adminService.adminAddMoney(userId, amount);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Money added successfully",
      wallet: result,
    });
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: err.message,
    });
  }
};