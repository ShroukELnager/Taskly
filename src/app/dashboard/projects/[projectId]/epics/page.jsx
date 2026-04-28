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
  const router = useRouter();

  const [epics, setEpics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedEpicId, setSelectedEpicId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const limit = 6;

  const fetchEpics = async () => {
    try {
      setLoading(true);
      setError("");

      const token = Cookies.get("access_token");
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEpics();
  }, [projectId, currentPage, refresh]);

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

const handleUpdateEpic = (updatedEpic) => {
  setEpics((prev) =>
    prev.map((epic) =>
      epic.id === updatedEpic.id ? updatedEpic : epic
    )
  );

};
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
            <input
              type="text"
              placeholder="Search epics"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="hidden lg:block pl-3 pr-3 py-2 rounded-md bg-[#D4DEFB] text-sm outline-none"
            />

            <button
              onClick={() =>
                router.push(`/dashboard/projects/${projectId}/epics/create`)
              }
              className="hidden lg:flex bg-[#014CBF] text-white px-4 py-2 rounded-md text-sm"
            >
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
                className="bg-white rounded-xl p-4 shadow-sm cursor-pointer"
              >
                <span className="text-xs text-blue-600">
                  {epic.epic_id}
                </span>

                <h2 className="mt-2 font-semibold">{epic.title}</h2>

                <div className="flex items-center gap-3 mt-4">
                  <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-lg">
                    {initials}
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Assignee</p>
                    <p className="text-sm">{name}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        <EpicsPagination
          currentPage={currentPage}
          totalCount={totalCount}
          limit={limit}
          onPageChange={setCurrentPage}
        />
      </div>

      <EpicDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        epicId={selectedEpicId}
        projectId={projectId}
        onUpdateEpic={handleUpdateEpic}
      />

      <button
        onClick={() =>
          router.push(`/dashboard/projects/${projectId}/epics/create`)
        }
        className="lg:hidden fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#014CBF] text-white"
      >
        +
      </button>
    </div>
  );
}