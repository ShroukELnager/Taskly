"use client";

import Sidebar from "../components/sidebar/sidebar";
import Navbar from "../components/navbar/navbar";
import Breadcrumbs from "../components/breadCrumb/breadCrumb";

export default function Dashboardlayout({ children }) {
  return (
    <div className="h-screen overflow-hidden bg-[#F9F9FF] flex justify-center">

      <div className="w-full max-w-[1440px] flex h-screen">

        <div className="h-full bg-[#F1F3FF]">
          <Sidebar />
        </div>

        <div className="flex flex-col flex-1 h-full min-h-0 min-w-0">

          <div className="w-full">
            <Navbar />
          </div>

          <div className="flex-1 min-h-0 min-w-0 overflow-y-auto p-4 bg-[#F9F9FF]">
            <Breadcrumbs/>
            {children}
          </div>

        </div>

      </div>
    </div>
  );
}
