"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Pagination from "@/app/components/Pagination";
import SkeletonCard from "@/app/components/skelton";

export default function Projects() {
  // ================= STATE =================

  // ✅ list المشاريع
  const [projects, setProjects] = useState([]);

  // ✅ loading state
  const [loading, setLoading] = useState(true);

  // ✅ pagination state (الصفحة الحالية)
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ العدد الكلي للمشاريع
  const [totalCount, setTotalCount] = useState(0);

  // ✅ عدد العناصر في كل صفحة
  const limit = 5;

  const router = useRouter();

  useEffect(() => {
    // ================= GET TOKEN =================
    // ✅ بنجيب access token من cookies
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];

    const fetchProjects = async () => {
      setLoading(true);

      // ================= PAGINATION =================
      // ✅ offset = نبدأ منين في الداتا
      // مثال: page 2 → offset = 5
      const offset = (currentPage - 1) * limit;

      try {
        const res = await fetch(
          `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/rpc/get_projects?limit=${limit}&offset=${offset}`,
          {
            method: "GET",
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Prefer: "count=exact", // ✅ مهم عشان نعرف total
            },
          },
        );

        const data = await res.json();

        // ================= TOTAL COUNT =================
        // ✅ بنجيب العدد الكلي من header
        const contentRange = res.headers.get("Content-Range");
        const total = contentRange?.split("/")[1];

        setProjects(data);
        setTotalCount(Number(total));
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentPage]); // ✅ كل ما الصفحة تتغير يعمل fetch

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ================= HEADER ================= */}
      <div className="p-4 flex justify-between items-center">
        <div>
          <h1 className="font-semibold text-3xl">Projects</h1>
          <p className="text-gray-600 text-sm">
            Manage and create your projects
          </p>
        </div>

        {/* ================= CREATE PROJECT ================= */}
        <button
          onClick={() => router.push("/dashboard/projects/create")}
          className="bg-[#014CBF] text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center gap-2"
        >
          <Image src="/images/plus.svg" alt="plus" width={16} height={16} />
          <p className="text-sm font-medium">Create Project</p>
        </button>
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        // ================= SKELETON LOADING =================
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        // ================= EMPTY STATE =================
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <div className="w-[60px] h-[60px] bg-[#E5EEFA] rounded-xl flex items-center justify-center mb-4">
            <Image src="/images/add.svg" alt="empty" width={30} height={30} />
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            You don’t have any projects yet.
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Start by creating your first project
          </p>

          <button
            onClick={() => router.push("/dashboard/projects/create")}
            className="mt-4 bg-[#014CBF] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Create Project
          </button>
        </div>
      ) : (
        <>
          {/* ================= PROJECTS GRID ================= */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                // ================= NEW (مهم جدًا) =================
                // ✅ لما المستخدم يضغط على المشروع
                // نوديه على صفحة epics الخاصة بالمشروع
                onClick={() => {
                  router.push(`/dashboard/projects/${project.id}/epics`);
                }}
                // ✅ ضفنا cursor-pointer عشان يبقى clickable
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md hover:scale-105 transition cursor-pointer"
              >
                {/* ================= PROJECT NAME ================= */}
                <h2 className="text-lg font-semibold text-gray-900">
                  {project.name || "Untitled Project"}
                </h2>

                {/* ================= DESCRIPTION ================= */}
                <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                  {project.description || "No description available"}
                </p>
                {/* ================= EDIT BUTTON ================= */}
                <button
                  onClick={(e) => {
                    // ================= STOP PROPAGATION =================
                    // ❌ عشان لما تدوس على edit ما ينفذش onClick بتاع الكارد (اللي بيروح epics)
                    e.stopPropagation();

                    // ================= NAVIGATE TO EDIT PAGE =================
                    router.push(`/dashboard/projects/${project.id}/edit`);
                  }}
                  className="mt-4 text-sm bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition"
                >
                  Edit
                </button>
                {/* ================= CREATED DATE ================= */}
                <div className="mt-6 flex justify-between items-center text-xs text-gray-400">
                  <span>CREATED AT</span>
                  <span>
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}

            {/* ================= ADD PROJECT CARD ================= */}
            <div className="bg-white border border-dashed hover:scale-105 hover:shadow-md rounded-xl flex items-center justify-center h-40 cursor-pointer hover:bg-gray-50">
              <div className="text-center text-gray-500 flex flex-col items-center justify-center">
                <div
                  onClick={() => router.push("/dashboard/projects/create")}
                  className="w-[40px] h-[40px] bg-[#E5EEFA] rounded-lg flex items-center justify-center"
                >
                  <Image
                    src="/images/add.svg"
                    alt="plus"
                    width={24}
                    height={24}
                  />
                </div>

                <p className="text-sm mt-2">Add Project</p>
              </div>
            </div>
          </div>

          {/* ================= PAGINATION ================= */}
          <div className="px-4">
            <Pagination
              currentPage={currentPage} // الصفحة الحالية
              totalCount={totalCount} // العدد الكلي
              limit={limit} // عدد العناصر لكل صفحة
              onPageChange={setCurrentPage} // تغيير الصفحة
            />
          </div>
        </>
      )}
    </div>
  );
}
