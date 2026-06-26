import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";

export const registerSchema = z
  .object({
    email: z.email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const registerResolver = zodResolver(
  registerSchema as never
) as Resolver<RegisterFormValues>;
