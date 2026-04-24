"use client";

import Image from "next/image";

export default function DashboardHome() {
  return (
    <div className="space-y-6">

      <div className="bg-gradient-to-r from-[#014CBF] to-blue-500 text-white p-6 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm opacity-90 mt-1">
          Here’s what’s happening with your projects today.
        </p>
      </div>

      {/*Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Total Projects</p>
          <h2 className="text-2xl font-semibold mt-2">12</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Active Projects</p>
          <h2 className="text-2xl font-semibold mt-2">8</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Completed</p>
          <h2 className="text-2xl font-semibold mt-2">4</h2>
        </div>

      </div>

  

  

    </div>
  );
}