import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/(?=.*[A-Z])/, "Must include uppercase letter")
      .regex(/(?=.*[a-z])/, "Must include lowercase letter")
      .regex(/(?=.*\d)/, "Must include a number")
      .regex(/(?=.*[!@#$%^&*])/, "Must include special character"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });