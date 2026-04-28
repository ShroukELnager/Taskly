"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { loginSchema } from "../components/schema/loginschema";
import { setUser, setAccessToken } from "../lib/features/users/userSlice";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setApiError("");

      const res = await fetch(
        "https://pcufxstnppfqmzgslxlk.supabase.co/auth/v1/token?grant_type=password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        setApiError(result.error_description || "Invalid email or password");
        return;
      }

      const { access_token, refresh_token } = result;

      console.log(access_token);

      Cookies.set("access_token", access_token, {
        secure: true,
        sameSite: "strict",
      });

      Cookies.set("refresh_token", refresh_token, {
        secure: true,
        sameSite: "strict",
      });

      dispatch(setAccessToken(access_token));
      dispatch(setUser(user));

      router.push("/dashboard/projects/projects");
    } catch (err) {
      setApiError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-[#F9F9FF] h-screen w-screen overflow-x-hidden">
      <div className="flex items-center gap-2 p-4">
        <Image src="/images/logo.svg" width={20} height={20} alt="logo" />
        <h1 className="font-bold text-xl">TASKLY</h1>
      </div>

      <div className="flex justify-center items-center min-h-screen px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
        >
          <div className="text-center space-y-1">
            <h1 className="font-bold text-2xl">Welcome Back</h1>
            <p className="text-gray-400 text-sm">
              Please enter your details to access your workspace
            </p>
          </div>

          {apiError && (
            <p className="text-red-500 text-sm text-center">{apiError}</p>
          )}

          <div className="space-y-1">
            <label className="text-sm text-[#8691A4] font-medium">
              EMAIL
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full h-12 px-3 rounded-md border bg-[#D7E2FF] focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-[#8691A4] font-medium">
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="Minimum 8 characters"
              {...register("password")}
              className="w-full h-12 px-3 rounded-md border bg-[#D7E2FF] focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* OPTIONS */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-[#014DC0]" />
              <span className="text-[#8691A4]">Remember me</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-[#014DC0] font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* BUTTON */}
          <button
            disabled={isSubmitting}
            className="w-full bg-[#014DC0] text-white h-12 rounded-md"
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>

          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-[#014DC0] font-semibold">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}