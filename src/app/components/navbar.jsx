"use client";

import Image from "next/image";
import { useSelector } from "react-redux";

export default function Navbar() {
  const user = useSelector((state) => state.users.user);
console.log("User in Navbar:", user);
  const name = user?.user_metadata?.name || "User";
  const jobTitle =
    user?.user_metadata?.job_title || "Frontend developer";

  const avatarUrl = user?.user_metadata?.avatar_url;

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-full h-16 bg-[#F9F9FF] border-b border-gray-300/60 flex items-center px-4">

      {/* USER */}
      <div className="flex items-center gap-3 ml-auto">

        {/* TEXT */}
        <div className="text-right">
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-gray-500">{jobTitle}</p>
        </div>

        {/* AVATAR */}
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            width={40}
            height={40}
            alt="avatar"
            className="w-10 h-10 rounded-lg border object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-lg border">
            {initials}
          </div>
        )}
      </div>
    </div>
  );
}