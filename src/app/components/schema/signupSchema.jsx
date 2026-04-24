import { z } from "zod";

export const SignupSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50)
      .regex(/^[\p{L}]+( [\p{L}]+)*$/u, "Invalid name format"),

    email: z.string().email("Invalid email address"),

    jobTitle: z.string().optional(),

    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/\d/)
      .regex(/[!@#$%^&*]/),

    confirmedPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: "Passwords do not match",
    path: ["confirmedPassword"],
  });

