"use client";

import Image from "next/image";
import Link from "next/link";
import Login from "./login/page";

export default function Home() {
  return (
    <div className="h-screen bg-[#F9F9FF] flex flex-col overflow-x-hidden">
      
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        
        <div className="flex items-center gap-2">
          <Image src="/images/logo.svg" width={20} height={20} alt="logo" />
          <h1 className="font-bold text-xl">TASKLY</h1>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-medium text-[#014DC0] border border-[#014DC0] rounded-md hover:bg-blue-50 transition"
          >
            Sign up
          </Link>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center text-center px-6 py-12">
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Manage your tasks <br />
          smarter with <span className="text-[#014DC0]">Taskly</span>
        </h1>

        <p className="text-gray-500 mt-4 max-w-xl">
          Organize your work, collaborate with your team, and boost productivity
          — all in one place.
        </p>

        <div className="flex gap-4 mt-6">
          <Link
            href="/signup"
            className="bg-[#014DC0] text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="px-6 py-3 border rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            Login
          </Link>
        </div>
      </section>


    </div>
  );
}