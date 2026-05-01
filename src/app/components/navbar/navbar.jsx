"use client";

import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const user = useSelector((state) => state.users.user);
  console.log("User in Navbar:", user);
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const router = useRouter();

  const name = user?.user_metadata?.name || "No name provided";
  const jobTitle = user?.user_metadata?.job_title || "No job title provided";

  const email = user?.email || "No email";

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setError("");

      const token = Cookies.get("access_token");

      const res = await fetch(
        "https://pcufxstnppfqmzgslxlk.supabase.co/auth/v1/logout",
        {
          method: "POST",
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Logout failed");

      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("user");

      router.push("/login");
    } catch (err) {
      setError("Logout failed, please try again.");
    }
  };

  return (
    <div className="w-full h-16 bg-[#F9F9FF] border-b border-gray-300/60 flex items-center px-4">
      <div
        className="flex items-center gap-3 ml-auto relative"
        ref={dropdownRef}
      >
        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-gray-500">{jobTitle}</p>
        </div>

        <div
          onClick={() => setOpen(!open)}
          className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-lg border cursor-pointer"
        >
          {initials}
        </div>

        {open && (
          <div className="absolute right-0 top-14 w-72 bg-white rounded-2xl shadow-xl p-4 space-y-4 z-50 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full text-sm font-semibold">
                {initials}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">{name}</p>
                <p className="text-xs text-gray-500">{email}</p>
              </div>
            </div>

            {/* logout button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 transition rounded-xl py-2 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
