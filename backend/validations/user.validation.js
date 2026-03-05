import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    phone: z.string().min(10).max(15).optional(),
  }),
});