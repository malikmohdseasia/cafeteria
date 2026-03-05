import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";
import { createPaymentIntentService } from "../services/payment.service.js";

export const createPaymentIntent = async (req, res) => {
  try {
    const data = await createPaymentIntentService();

    res.status(HTTP_STATUS.OK).json({
      message: MESSAGES.PAYMENT.PAYMENT_CREATED,
      ...data,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: error.message,
    });
  }
};