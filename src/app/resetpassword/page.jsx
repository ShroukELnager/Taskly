"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { resetPasswordSchema } from "../components/schema/resetPasswordSchema";
import Link from "next/link";

const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const baseURL = process.env.Base_URL;

export default function ResetPassword() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch("password") || "";

  /* password rules (same logic style as signup) */
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);

  const onSubmit = async (data) => {
    try {
      const token = Cookies.get("access_token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${baseURL}/reset-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        console.log("Error:", result.error_description);
        return;
      }

      router.push("/login");
    } catch (error) {
      console.log("error:", error);
    }
  };

  return (
    <div className="bg-[#F9F9FF] min-h-screen overflow-x-hidden">
      {/* HEADER */}
      <div className="flex items-center gap-2 p-4">
        <Image src="/images/logo.svg" width={20} height={20} alt="logo" />
        <h1 className="font-bold text-xl">TASKLY</h1>
      </div>

      {/* FORM */}
      <div className="flex justify-center items-center min-h-screen px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5"
        >
          <h1 className="text-2xl font-bold text-center">
            Create New Password
          </h1>

          <p className="text-gray-400 text-sm text-center">
            Secure your account with a strong password
          </p>

          {/* PASSWORD */}
          <div className="space-y-1">
            <label className="text-sm text-[#8691A4] font-medium">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full h-12 px-3 rounded-md bg-[#D7E2FF] outline-none"
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              ></button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="space-y-1">
            <label className="text-sm text-[#8691A4] font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              className="w-full h-12 px-3 rounded-md bg-[#D7E2FF] outline-none"
              {...register("confirmPassword")}
            />

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* RULES (SAME SIGNUP STYLE) */}
          <div className="bg-[#1a369e] p-4 rounded-lg text-sm">
            <p>security Requirements:</p>
            <br />
            <div className="flex gap-6">
              {/* LEFT COLUMN (3 rules) */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Image
                    src={
                      hasLength ? "/images/radiocheck.svg" : "/images/Icon.svg"
                    }
                    width={14}
                    height={14}
                    alt="status"
                  />
                  <span
                    className={hasLength ? "text-green-600" : "text-gray-500"}
                  >
                    8+ characters
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Image
                    src={
                      hasUpper ? "/images/radiocheck.svg" : "/images/Icon.svg"
                    }
                    width={14}
                    height={14}
                    alt="status"
                  />
                  <span
                    className={hasUpper ? "text-green-600" : "text-gray-500"}
                  >
                    Uppercase letter
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Image
                    src={
                      hasSpecial ? "/images/radiocheck.svg" : "/images/Icon.svg"
                    }
                    width={14}
                    height={14}
                    alt="status"
                  />
                  <span
                    className={hasSpecial ? "text-green-600" : "text-gray-500"}
                  >
                    One special character
                  </span>
                </div>
              </div>

              {/* RIGHT COLUMN (2 rules) */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Image
                    src={
                      hasLower ? "/images/radiocheck.svg" : "/images/Icon.svg"
                    }
                    width={14}
                    height={14}
                    alt="status"
                  />
                  <span
                    className={hasLower ? "text-green-600" : "text-gray-500"}
                  >
                    Lowercase letter
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Image
                    src={
                      hasDigit ? "/images/radiocheck.svg" : "/images/Icon.svg"
                    }
                    width={14}
                    height={14}
                    alt="status"
                  />
                  <span
                    className={hasDigit ? "text-green-600" : "text-gray-500"}
                  >
                    One digit
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <button className="w-full bg-[#014DC0] text-white h-12 rounded-md hover:opacity-90 transition">
            Update Password
          </button>
          <br />
          <br />
          <p className="text-center text-sm text-[#8691A4] ">
            <Link href="/signin" className="text-[#014DC0] hover:underline ">
              Back to Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
