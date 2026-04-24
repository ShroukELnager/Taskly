import { z } from "zod";

export const CreateProjSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});