"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/app/services/auth.service";

export default function ForgotPassword() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: forgotPassword,

    onSuccess: () => {
      setMessage(
        "If an account exists with this email, we’ve sent a password reset link."
      );

      setAttempts((prev) => prev + 1);
      setCooldown(30);
      reset();
    },

    onError: () => {
      setError("Network error. Please try again.");
    },
  });

  const onSubmit = (data) => {
    setError("");
    setMessage("");

    if (attempts >= 3) {
      setError("Maximum reset attempts reached. Try again later.");
      return;
    }

    mutation.mutate(data);
  };

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const canResend = cooldown === 0 && attempts < 3;

  const formatTime = (sec) => `${sec}s`;

  return (
    <div className="bg-[#F5F6FA] min-h-screen px-4">

      <div className="flex items-center gap-2 p-4">
        <Image src="/images/logo.svg" width={20} height={20} alt="logo" />
        <h1 className="font-bold text-xl">TASKLY</h1>
      </div>

      <div className="flex items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white rounded-xl p-8 shadow-sm"
        >
          <h1 className="text-2xl font-bold text-[#1C274C]">
            Forgot password?
          </h1>

          <p className="text-sm text-gray-400 mt-2">
            No worries, we’ll send you reset instructions.
          </p>

          <label className="block text-xs text-gray-500 mt-6 mb-2 uppercase">
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full h-12 px-4 rounded-md bg-[#E6ECFF] outline-none text-sm"
            {...register("email", { required: true })}
          />

          <button
            type="submit"
            disabled={mutation.isPending || !canResend}
            className={`w-full h-12 mt-4 rounded-md text-white text-sm font-medium ${
              mutation.isPending || !canResend
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#0B4DBA]"
            }`}
          >
            {mutation.isPending
              ? "Sending..."
              : cooldown > 0
              ? `Resend in ${formatTime(cooldown)}`
              : "Send Reset Link"}
          </button>

          <div className="mt-4 text-sm text-[#0B4DBA]">
            <Link href="/login" className="flex items-center gap-1">
              <Image
                src="/images/back.png"
                alt="arrow left"
                width={17}
                height={17}
              />
              Back to log in
            </Link>
          </div>

          {message && (
            <div className="mt-6 bg-green-50 text-green-700 text-sm p-4 rounded-md flex items-start gap-2">
              <Image
                src="/images/check.png"
                alt="check"
                width={20}
                height={20}
              />
              <p>{message}</p>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 mb-2 uppercase">
              Didn’t receive the email?
            </p>

            <button
              type="button"
              disabled={!canResend}
              className="w-full h-12 rounded-md bg-[#EEF1F7] text-gray-400 text-sm flex items-center justify-center gap-2"
            >
              <Image
                src="/images/clock.png"
                alt="refresh"
                width={14}
                height={14}
              />
              {cooldown > 0
                ? `Resend in ${formatTime(cooldown)}`
                : "Resend"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}