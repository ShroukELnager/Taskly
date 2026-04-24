"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Pagination from "@/app/components/Pagination"; // ✅ NEW

export default function EpicsPage() {
  const { projectId } = useParams();

  /* ================= STATE ================= */
  const [epics, setEpics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ NEW: search state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ✅ NEW: pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 6;

  const router = useRouter();

  /* ================= FETCH ================= */
  const fetchEpics = async () => {
    try {
      setLoading(true);
      setError("");

      const token = Cookies.get("access_token");

      if (!token) throw new Error("Unauthorized");

      // ✅ NEW: offset
      const offset = (currentPage - 1) * limit;

      const res = await fetch(
        `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/project_epics?project_id=eq.${projectId}&limit=${limit}&offset=${offset}`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Prefer: "count=exact", // ✅ NEW
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch epics");

      const data = await res.json();

      // ✅ NEW: total count
      const contentRange = res.headers.get("Content-Range");
      const total = contentRange?.split("/")[1];

      setEpics(data);
      setTotalCount(Number(total)); // ✅ NEW
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEpics();
  }, [projectId, currentPage]); // ✅ UPDATED (added currentPage)

  // ✅ NEW: debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // ✅ NEW: filtering
  const filteredEpics = epics.filter((epic) => {
    const title = epic.title?.toLowerCase() || "";
    const epicId = epic.epic_id?.toLowerCase() || "";
    const assignee =
      epic?.assignee?.name?.toLowerCase() ||
      epic?.assignee?.email?.toLowerCase() ||
      "";

    return (
      title.includes(debouncedSearch.toLowerCase()) ||
      epicId.includes(debouncedSearch.toLowerCase()) ||
      assignee.includes(debouncedSearch.toLowerCase())
    );
  });

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-40 bg-white rounded-xl shadow-sm animate-pulse"
          />
        ))}
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-red-500 font-medium">{error}</p>

        <button
          onClick={fetchEpics}
          className="mt-4 bg-[#014CBF] text-white px-4 py-2 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (epics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-lg font-semibold">No Epics Yet</h2>
        <p className="text-gray-500 mt-2">
          Start by creating your first epic
        </p>

        <button
          onClick={() =>
            router.push(`/dashboard/projects/${projectId}/epics/create`)
          }
          className="mt-4 bg-[#014CBF] text-white px-4 py-2 rounded-md"
        >
          Create Epic
        </button>
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="p-4">
      {/* HEADER */}
     <div className="flex items-center justify-between mb-6">
  {/* LEFT: TITLE */}
  <h1 className="text-2xl font-semibold">Project Epics</h1>

  {/* RIGHT: SEARCH + BUTTON */}
  <div className="flex items-center gap-3">
    
    {/* SEARCH */}
    <div className="relative">
      {/* ICON */}
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
        <Image
          src="/images/search.svg"
          width={15}
          height={15}
          alt="search"  />
      </span>

      {/* INPUT */}
      <input
        type="text"
        placeholder="Search epics..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-9 pr-3 py-2 rounded-md bg-[#D4DEFB] border border-blue-100 text-sm outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>

    {/* BUTTON */}
    <button
      onClick={() =>
        router.push(`/dashboard/projects/${projectId}/epics/create`)
      }
      className="bg-[#014CBF] text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
    >
      + New Epic
    </button>
  </div>
</div>

      {/* GRID */}
      {/* ✅ NEW: no results */}
      {filteredEpics.length === 0 && (
        <div className="text-center text-gray-500 mb-4">
          No results found
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEpics.map((epic) => {
          const name =
            epic?.assignee?.name ||
            epic?.assignee?.email ||
            "Unassigned";

          const initials = name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase();

          return (
            <div
              key={epic.id}
              className="bg-[#F9FAFB] rounded-xl p-4 shadow-sm border-l-4 border-[#014CBF] hover:shadow-md transition"
            >
              <span className="inline-block bg-green-100 text-[#014CBF] text-xs font-medium px-2 py-1 rounded-md">
                {epic.epic_id || "EPIC"}
              </span>

              <h2 className="mt-2 font-semibold text-gray-900 text-lg">
                {epic.title}
              </h2>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#014CBF] text-white rounded-lg flex items-center justify-center text-sm font-semibold">
                    {initials}
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Assignee</p>
                    <p className="text-sm font-medium text-gray-800">
                      {name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                <span>
                  Created by:{" "}
                  {epic?.created_by?.name ||
                    epic?.created_by?.email ||
                    "-"}
                </span>

                <span>
                  {new Date(epic.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          limit={limit}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}