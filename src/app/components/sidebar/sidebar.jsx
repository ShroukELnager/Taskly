"use client";

import Image from "next/image";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams, usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { projectId } = useParams();
  const pathname = usePathname();

  const isProjectSelected = !!projectId;

  const projectLinks = [
    {
      name: "Project Epics",
      icon: "/images/epics.svg",
      href: `/projects/${projectId}/epics`,
    },
    {
      name: "Project Tasks",
      icon: "/images/tasks.svg",
      href: `/projects/${projectId}/tasks`,
    },
    {
      name: "Project Member",
      icon: "/images/member.svg",
      href: `/projects/${projectId}/members`,
    },
    {
      name: "Project Details",
      icon: "/images/details.svg",
      href: `/projects/${projectId}/edit`,
    },
  ];

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
    <>
      <div className="md:hidden flex items-start justify-start p-3 bg-[#F1F3FF]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-2xl md:hidden"
          >
            <Image
              src="/images/humberger.png"
              width={20}
              height={18}
              alt="menu"
            />
          </button>
          <span className="font-bold">TASKLY</span>
        </div>
      </div>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden"
        />
      )}

      <div
        className={`
          fixed md:static top-0 left-0 z-50
          min-h-screen bg-[#F1F3FF] border-r border-gray-200/60 flex flex-col
          transition-all duration-300
          ${open ? "w-64" : "w-20"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center gap-2 px-5 py-4">
          <Image src="/images/logo.svg" width={28} height={28} alt="logo" />

          {open && (
            <h1 className="font-bold text-xl whitespace-nowrap">TASKLY</h1>
          )}
        </div>

        <nav className="flex-1 px-2 py-6">
          <ul className="flex flex-col gap-4 px-5">
            <li
              className={`flex items-center py-2 rounded-md hover:bg-gray-100 cursor-pointer transition ${
                open ? "gap-3 px-2" : "justify-center px-0"
              }`}
            >
              <Image
                src="/images/proj.png"
                width={20}
                height={18}
                alt="Projects"
                className="w-5 h-5 shrink-0"
              />

              {open && (
                <Link href="/projects">
                  <span className="text-sm font-medium">Projects</span>
                </Link>
              )}
            </li>

            {isProjectSelected &&
              projectLinks.map((link) => {
                const active = pathname === link.href;

                return (
                  <li
                    key={link.name}
                    className={`flex items-center py-3 rounded-md transition
                    ${
                      !isProjectSelected
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-gray-100 cursor-pointer"
                    }
                    ${open ? "gap-4 px-2" : "justify-center px-0"}
                    ${active ? "bg-white" : ""}
                  `}
                  >
                    <Image
                      src={link.icon}
                      width={20}
                      height={18}
                      alt={link.name}
                      className="w-5 h-5 shrink-0"
                    />

                    {open &&
                      (isProjectSelected ? (
                        <Link href={link.href} className="text-sm">
                          {link.name}
                        </Link>
                      ) : (
                        <span className="text-sm">{link.name}</span>
                      ))}
                  </li>
                );
              })}
          </ul>

          {!isProjectSelected && open && (
            <p className="text-xs text-gray-400 px-5 mt-4">
              Select a project first
            </p>
          )}
        </nav>

        <div className="mt-auto px-2 py-5 flex flex-col gap-3">
          <button
            onClick={() => setOpen(!open)}
            className={`hidden md:flex items-center py-3 rounded-md hover:bg-gray-100 transition ${
              open ? "gap-4 px-5" : "justify-center px-0"
            }`}
          >
            <Image
              src={open ? "/images/arrowleft.svg" : "/images/arrowright.svg"}
              width={10}
              height={10}
              alt="toggle"
              className="shrink-0"
            />
            {open && <span>Collapse</span>}
          </button>

          <div
            onClick={handleLogout}
            className={`flex items-center py-3 rounded-md hover:bg-gray-100 cursor-pointer transition ${
              open ? "gap-4 px-5" : "justify-center px-0"
            }`}
          >
            <Image
              src="/images/logout.svg"
              width={20}
              height={18}
              alt="logout"
              className="w-5 h-5 shrink-0"
            />
            {open && <span>Logout</span>}
          </div>

          {error && <p className="text-red-500 text-xs px-5">{error}</p>}
        </div>
      </div>
    </>
  );
}
