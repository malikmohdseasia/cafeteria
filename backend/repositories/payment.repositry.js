import Stripe from "stripe";
import { ENV } from "../config/env.js";

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);

export const createPaymentIntentRepo = (amount) => {
  return stripe.paymentIntents.create({
    amount: amount * 100, 
    currency: "inr",
    payment_method_types: ["card"],
  });
};