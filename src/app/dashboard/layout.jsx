"use client";

import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

export default function Dashboardlayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F9F9FF] flex justify-center">

      {/* CONTAINER */}
      <div className="w-full max-w-[1440px] flex h-screen">

        {/* SIDEBAR */}
        <div className="h-full">
          <Sidebar />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col flex-1 h-full">

          {/* NAVBAR */}
          <div className="w-full">
            <Navbar />
          </div>

          {/* CONTENT */}
          <div className="flex-1 p-4">
            {children}
          </div>

        </div>

      </div>
    </div>
  );
}