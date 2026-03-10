import Food from "../ models/food.model.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export const toggleFoodVisibility = async (req, res) => {
  const { foodId } = req.params;
  const { isVisible } = req.body;

  const food = await Food.findByIdAndUpdate(
    foodId,
    { isVisible },
    { new: true }
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: food,
  });
};