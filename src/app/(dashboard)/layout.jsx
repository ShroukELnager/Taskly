"use client";

import Sidebar from "../components/sidebar/sidebar";
import Navbar from "../components/navbar/navbar";
import Breadcrumbs from "../components/breadCrumb/breadCrumb";

export default function Dashboardlayout({ children }) {
  return (
    <div className="min-h-dvh bg-[#F9F9FF]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1920px]">
        <Sidebar />

        <div className="flex min-h-dvh min-w-0 flex-1 flex-col pt-14 md:pt-0">
          <Navbar />

          <div className="min-w-0 flex-1 bg-[#F9F9FF] px-4 py-4 sm:px-6 sm:py-5 lg:px-8 xl:px-10">
            <div className="mx-auto w-full max-w-[1600px]">
              <Breadcrumbs />
            {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
