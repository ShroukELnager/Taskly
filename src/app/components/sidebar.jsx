"use client";

import Image from "next/image";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams, usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  // ✅ state للتحكم في فتح/قفل السايدبار (desktop)
  const [open, setOpen] = useState(true);

  // ✅ state للـ mobile sidebar
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ error message في حالة logout فشل
  const [error, setError] = useState("");

  const router = useRouter();

  // ✅ بنجيب projectId من ال URL
  // مثال: /project/123/epics → projectId = 123
  const { projectId } = useParams();

  // ✅ بنجيب المسار الحالي
  // مثال: /project/123/tasks
  const pathname = usePathname();

  // ✅ نحول projectId لـ boolean
  // لو فيه project → true
  // لو مفيش → false
  const isProjectSelected = !!projectId;

  // ✅ اللينكات الخاصة بالمشروع (dynamic)
  // كل link بيعتمد على projectId
  const projectLinks = [
    {
      name: "Project Epics",
      icon: "/images/epics.svg",
      href: `/dashboard/projects/${projectId}/epics`,
    },
    {
      name: "Project Tasks",
      icon: "/images/tasks.svg",
      href: `/dashboard/projects/${projectId}/tasks`,
    },
    {
      name: "Project Member",
      icon: "/images/member.svg",
      href: `/dashboard/projects/${projectId}/members`,
    },
    {
      name: "Project Details",
      icon: "/images/details.svg",
      href: `/dashboard/projects/${projectId}/edit`,
    },
  ];

  // ✅ logout function
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
        }
      );

      if (!res.ok) throw new Error("Logout failed");

      // ✅ مسح التوكنات
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("user");

      // ✅ تحويل لصفحة اللوجن
      router.push("/login");
    } catch (err) {
      setError("Logout failed, please try again.");
    }
  };

  return (
    <>
      {/* ================= MOBILE TOP BAR ================= */}
      <div className="md:hidden flex items-center justify-between p-3 bg-[#F1F3FF]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-2xl md:hidden"
          >
            ☰
          </button>
          <span className="font-bold">TASKLY</span>
        </div>
      </div>

      {/* ================= OVERLAY ================= */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <div
        className={`
          fixed md:static top-0 left-0 z-50
          min-h-screen bg-[#F1F3FF] border-r border-gray-200/60 flex flex-col
          transition-all duration-300

          /* ✅ عرض السايدبار */
          ${open ? "w-64" : "w-20"}

          /* ✅ mobile animation */
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* ================= LOGO ================= */}
        <div className="flex items-center gap-2 px-5 py-4">
          <Image src="/images/logo.svg" width={28} height={28} alt="logo" />

          {/* ✅ يظهر الاسم بس لو السايدبار مفتوح */}
          {open && (
            <h1 className="font-bold text-xl whitespace-nowrap">TASKLY</h1>
          )}
        </div>

        {/* ================= NAV ================= */}
        <nav className="flex-1 px-2 py-6">
          <ul className="flex flex-col gap-4 px-5">

            {/* ================= PROJECTS LINK ================= */}
            <li className="flex items-center gap-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition">
              <Image src="/images/projects 2.svg" width={45} height={45} alt="Projects" />

              {open && (
                <Link href="/dashboard/projects/projects">
                  <span className="text-sm font-medium">Projects</span>
                </Link>
              )}
            </li>

            {/* ================= PROJECT LINKS ================= */}
            {projectLinks.map((link) => {

              // ✅ check لو اللينك ده هو الصفحة الحالية
              const active = pathname === link.href;

              return (
                <li
                  key={link.name}
                  className={`flex items-center gap-4 py-3 rounded-md transition

                    /* ❌ لو مفيش project */
                    ${
                      !isProjectSelected
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-gray-100 cursor-pointer"
                    }

                    /* ✅ active page */
                    ${active ? "bg-white" : ""}
                  `}
                >
                  <Image src={link.icon} width={20} height={18} alt={link.name} />

                  {open && (
                    isProjectSelected ? (
                      // ✅ لو فيه project → اللينك يشتغل
                      <Link href={link.href} className="text-sm">
                        {link.name}
                      </Link>
                    ) : (
                      // ❌ لو مفيش project → نص بس (disabled)
                      <span className="text-sm">{link.name}</span>
                    )
                  )}
                </li>
              );
            })}
          </ul>

          {/* ✅ رسالة توضيحية لو مفيش project */}
          {!isProjectSelected && open && (
            <p className="text-xs text-gray-400 px-5 mt-4">
              Select a project first
            </p>
          )}
        </nav>

        {/* ================= BOTTOM ================= */}
        <div className="mt-auto px-2 py-5 flex flex-col gap-3">

          {/* ================= COLLAPSE ================= */}
          <button
            onClick={() => setOpen(!open)}
            className="hidden md:flex items-center gap-4 px-5 py-3 rounded-md hover:bg-gray-100 transition"
          >
            <Image
              src={open ? "/images/arrowleft.svg" : "/images/arrowright.svg"}
              width={10}
              height={10}
              alt="toggle"
            />
            {open && <span>Collapse</span>}
          </button>

          {/* ================= LOGOUT ================= */}
          <div
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-3 rounded-md hover:bg-gray-100 cursor-pointer transition"
          >
            <Image src="/images/logout.svg" width={20} height={18} alt="logout" />
            {open && <span>Logout</span>}
          </div>

          {/* ✅ error message */}
          {error && <p className="text-red-500 text-xs px-5">{error}</p>}
        </div>
      </div>
    </>
  );
}