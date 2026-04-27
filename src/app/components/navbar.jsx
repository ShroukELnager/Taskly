"use client";

import { useSelector } from "react-redux";

export default function Navbar() {
  const user = useSelector((state) => state.users.user);
console.log("User in Navbar:", user);
  const name = user?.user_metadata?.name || "No name provided";
  const jobTitle =
    user?.user_metadata?.job_title || "No job title provided";

  const avatarUrl = user?.user_metadata?.avatar_url;

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-full h-16 bg-[#F9F9FF] border-b border-gray-300/60 flex items-center px-4">

      <div className="flex items-center gap-3 ml-auto">

        <div className="text-right">
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-gray-500">{jobTitle}</p>
        </div>

       
          <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-lg border">
            {initials}
          </div>
        
      </div>
    </div>
  );
}