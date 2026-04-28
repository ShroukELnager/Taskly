"use client";

import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import Breadcrumbs from "../components/breadCrumb/breadCrumb";

export default function Dashboardlayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F9F9FF] flex justify-center">

      <div className="w-full max-w-[1440px] flex h-screen">

        <div className="h-full bg-[#F1F3FF]">
          <Sidebar />
        </div>

        <div className="flex flex-col flex-1 h-full">

          <div className="w-full">
            <Navbar />
          </div>

          <div className="flex-1 p-4">
            <Breadcrumbs/>
            {children}
          </div>

        </div>

      </div>
    </div>
  );
}