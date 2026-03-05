import { ZodError } from "zod";
import { MESSAGES } from "../constants/messages.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message:  MESSAGES.COMMON.VALIDATION_ERROR,
      });
    }
    next(error);
  }
};