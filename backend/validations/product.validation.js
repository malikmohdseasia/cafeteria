import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    category: z.string(),
  }),
});