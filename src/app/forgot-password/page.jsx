"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function ForgotPassword() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const baseURL = process.env.Base_URL;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit = async (data) => {
    try {
      setMessage("");
      setError("");

      if (attempts >= 3) {
        setError("Maximum attempts reached. Try later.");
        return;
      }

      const res = await fetch(`${baseURL}/auth/v1/recover`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      setAttempts((prev) => prev + 1);
      setCooldown(300); // 5 minutes

      setMessage(
        "If an account exists with this email, we’ve sent a password reset link.",
      );
    } catch (err) {
      setError("Network error. Try again.");
    }
  };

  return (
    <div className="bg-[#F9F9FF] min-h-screen">
      {/* HEADER */}
      <div className="flex items-center gap-2 p-4">
        <Image src="/images/logo.svg" width={20} height={20} alt="logo" />
        <h1 className="font-bold text-xl">TASKLY</h1>
      </div>

      {/* FORM */}
      <div className="flex justify-center items-center min-h-screen px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
        >
          <h1 className="text-2xl font-bold text-center">Forgot Password</h1>

          <p className="text-gray-400 text-sm text-center">
            Enter your email to reset password
          </p>

          {message && (
            <p className="text-green-600 text-sm text-center">{message}</p>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full h-12 px-3 rounded-md bg-[#D7E2FF]"
            {...register("email", { required: true })}
          />

          {/* BUTTON */}
          <button
            disabled={isSubmitting || cooldown > 0}
            className="w-full bg-[#014DC0] text-white h-12 rounded-md"
          >
            {cooldown > 0
              ? `Wait ${Math.floor(cooldown / 60)}:${cooldown % 60}`
              : "Send Reset Link"}
          </button>

          {/* BACK */}
          <p className="text-center text-sm">
            <Link href="/login" className="text-[#014DC0]">
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
