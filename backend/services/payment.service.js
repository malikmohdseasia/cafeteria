import { createPaymentIntentRepo } from "../repositories/payment.repositry.js";

export const createPaymentIntentService = async () => {
  
  const amount = 500; 

  if (amount <= 0) {
    throw new Error("Invalid amount");
  }

  const paymentIntent = await createPaymentIntentRepo(amount);

  return {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    amount,
  };
};