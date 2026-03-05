import { z } from "zod";
import { strongPassword } from "./common.schema.js";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name is too short"),
    email: z.string().email("Invalid email"),
    role: z.enum(["USER", "ADMIN", "SUPER_ADMIN"]).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp:z.string().otp(),
  }),
});

