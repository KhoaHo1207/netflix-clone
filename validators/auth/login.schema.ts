import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const loginResolver = zodResolver(
  loginSchema as never,
) as Resolver<LoginFormValues>;
