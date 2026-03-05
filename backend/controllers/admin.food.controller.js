import Food from "../ models/food.model.js";

export const toggleFoodVisibility = async (req, res) => {
  const { foodId } = req.params;
  const { isVisible } = req.body;

  const food = await Food.findByIdAndUpdate(
    foodId,
    { isVisible },
    { new: true }
  );

  res.json({
    success: true,
    data: food,
  });
};