"use client";

import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";





export default function Dashboardlayout({ children }) {
  return (
    <div className="h-screen flex bg-[#F9F9FF] ">

      {/* SIDEBAR */}
      <div className=" h-full">
        <Sidebar />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col flex-1 h-full ">

        {/* NAVBAR */}
        <div className="w-full">
          <Navbar />
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-4 overflow-auto ">
          {children}

        </div>

      </div>

    </div>
  );
}