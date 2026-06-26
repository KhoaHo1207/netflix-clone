"use client";

import Background from "@/components/auth/Background";
import Header from "@/components/auth/Header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import {
  loginResolver,
  type LoginFormValues,
} from "@/validators/auth/login.schema";
import axios from "axios";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: loginResolver,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async ({ email, password }: LoginFormValues) => {
    setError("");

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      await axios.post("/api/auth/login").catch((err) => {
        setError(err.response?.data?.error || "An error occurred during login");
      });

      router.push("/");
    } catch (err) {
      console.log("There was an error loggin in", err);
      setError("An error occurred during login");
    }
  };

  return (
    <div className="relative flex h-screen flex-col">
      <Header />
      <Background />

      <div className="flex flex-1 items-center justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full max-w-md flex-col gap-4 rounded-lg bg-black/65 p-8"
          >
            <h1 className="mb-4 text-2xl font-bold text-white">Sign In</h1>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-white/80">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-white/80">
                    Password
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="size-4" />
                      ) : (
                        <EyeOffIcon className="size-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                  <Link
                    href="/forgot-password"
                    className="mt-1 self-end text-xs text-white/50 hover:text-white"
                  >
                    Forgot password?
                  </Link>
                </FormItem>
              )}
            />

            {error && <p className="text-xs text-red-500">{error}</p>}

            <Button
              type="submit"
              variant="brand-primary"
              className="h-12"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
