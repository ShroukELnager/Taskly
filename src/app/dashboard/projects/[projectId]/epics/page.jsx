"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import EpicsPagination from "@/app/components/paginations/epics";
import EmptyEpics from "@/app/components/emptyPages/epics";
import EpicsError from "@/app/components/errorsPages/epics";
import EpicsSkeleton from "@/app/components/skeleton/epics";
import EpicDetailsModal from "./modale";
export default function EpicsPage() {
  const { projectId } = useParams();

  const [epics, setEpics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // ✅ الجديد
  const [selectedEpicId, setSelectedEpicId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const limit = 6;
  const router = useRouter();

  const fetchEpics = async () => {
    try {
      setLoading(true);
      setError("");

      const token = Cookies.get("access_token");
      if (!token) throw new Error("Unauthorized");

      const offset = (currentPage - 1) * limit;

      const res = await fetch(
        `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/project_epics?project_id=eq.${projectId}&limit=${limit}&offset=${offset}`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Prefer: "count=exact",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch epics");

      const data = await res.json();
      const contentRange = res.headers.get("Content-Range");
      const total = contentRange?.split("/")[1];

      setEpics(data);
      setTotalCount(Number(total));
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEpics();
  }, [projectId, currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

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

  if (loading) return <EpicsSkeleton />;
  if (error) return <EpicsError fetchEpics={fetchEpics} />;
  if (epics.length === 0) return <EmptyEpics projectId={projectId} />;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center pb-24 sm:pb-10">

      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <h1 className="text-2xl font-semibold hidden lg:block">
            Project Epics
          </h1>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">

            <div className="relative hidden lg:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                <Image src="/images/search.svg" width={15} height={15} alt="search" />
              </span>

              <input
                type="text"
                placeholder="Search epics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-md bg-[#D4DEFB] border border-blue-100 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <button
              onClick={() =>
                router.push(`/dashboard/projects/${projectId}/epics/create`)
              }
              className="hidden lg:flex bg-[#014CBF] text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 items-center gap-2 whitespace-nowrap"
            >
              <Image src="/images/plus.svg" width={18} height={18} alt="add" />
              New Epic
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">

          {filteredEpics.map((epic) => {
            const name =
              epic?.assignee?.name || epic?.assignee?.email || "Unassigned";

            const initials = name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase();

            return (
              <div
                key={epic.id}
                onClick={() => {
                  setSelectedEpicId(epic.id);
                  setIsModalOpen(true);
                }}
                className="bg-[#F9FAFB] rounded-xl p-4 shadow-sm border-l-4 border-[#014CBF] cursor-pointer hover:shadow-md transition"
              >
                <span className="inline-block bg-green-100 text-[#014CBF] text-xs font-medium px-2 py-1 rounded-md">
                  {epic.epic_id || "EPIC"}
                </span>

                <h2 className="mt-2 font-semibold text-gray-900 text-lg">
                  {epic.title}
                </h2>

                <div className="flex items-center gap-3 mt-4">
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
            );
          })}

        </div>

        <div className="px-4 pb-20">
          <EpicsPagination
            currentPage={currentPage}
            totalCount={totalCount}
            limit={limit}
            onPageChange={setCurrentPage}
          />
        </div>

      </div>

      {/* ✅ MODAL */}
      <EpicDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        epicId={selectedEpicId}
        projectId={projectId}
      />

      {/* MOBILE BUTTON */}
      <button
        onClick={() =>
          router.push(`/dashboard/projects/${projectId}/epics/create`)
        }
        className="lg:hidden fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#014CBF] text-white flex items-center justify-center shadow-lg z-50"
      >
        +
      </button>

    </div>
  );
}