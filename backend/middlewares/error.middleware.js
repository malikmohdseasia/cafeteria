import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";

export const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message: MESSAGES.AUTH.USER_ALREADY_EXISTS,
    });
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || MESSAGES.COMMON.INTERNAL_SERVER_ERROR,
  });
};