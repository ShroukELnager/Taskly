"use client";

import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";

import EpicsSkeleton from "@/app/components/skeleton/epics";
import EpicDetailsModal from "./modale";
import Pagination from "@/app/components/paginations";
import { useDebounce } from "@/app/hooks/useDebounce";

export default function EpicsPage() {
  const { projectId } = useParams();
  const router = useRouter();

  const [loadingMore, setLoadingMore] = useState(false);
  const [epics, setEpics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedEpicId, setSelectedEpicId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const limit = 6;

  const loaderRef = useRef(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  // =========================
  // FETCH EPICS
  // =========================
  const fetchEpics = async (page = 1, append = false, searchValue = "") => {
    try {
      if (!projectId) return;

      setError("");
      if (!append) setLoading(true);
      if (append) setLoadingMore(true);

      const token = Cookies.get("access_token");
      const offset = (page - 1) * limit;

      let url = `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/project_epics?project_id=eq.${projectId}&limit=${limit}&offset=${offset}`;

      if (searchValue) {
        url += `&title=ilike.%25${searchValue}%25`;
      }

      const res = await fetch(url, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Prefer: "count=exact",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch epics");

      const data = await res.json();

      const contentRange = res.headers.get("Content-Range");
      const total = contentRange?.split("/")[1];

      setTotalCount(Number(total));

      if (append) {
        setEpics((prev) => [...prev, ...data]);
      } else {
        setEpics(data);
      }
    } catch (err) {
      setError("Failed to fetch epics");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // =========================
  // RESET WHEN SEARCH CHANGES
  // =========================
  useEffect(() => {
    setCurrentPage(1);
    setEpics([]);
  }, [debouncedSearch]);

  // =========================
  // FETCH ON CHANGE
  // =========================
  useEffect(() => {
    fetchEpics(currentPage, false, debouncedSearch);
  }, [projectId, currentPage, debouncedSearch]);

  // =========================
  // UPDATE EPIC
  // =========================
  const handleUpdateEpic = (updatedEpic) => {
    setEpics((prev) =>
      prev.map((epic) => (epic.id === updatedEpic.id ? updatedEpic : epic)),
    );
  };

  // =========================
  // INFINITE SCROLL (MOBILE)
  // =========================
  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const nextPage = currentPage + 1;

        const hasMore = epics.length < totalCount && !debouncedSearch;

        if (hasMore && !loadingMore) {
          setCurrentPage(nextPage);
          fetchEpics(nextPage, true, debouncedSearch);
        }
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [currentPage, epics, totalCount, loadingMore, debouncedSearch]);

  // =========================
  // LOADING STATE
  // =========================
  if (loading && epics.length === 0) return <EpicsSkeleton />;

  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center pb-24 sm:pb-10">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 pt-4">
          {/* LEFT */}
          <h1 className="text-2xl font-semibold hidden lg:block">
            Project Epics
          </h1>

          {/* RIGHT */}
          <div className="flex items-center gap-3 ml-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search epics..."
              className="pl-3 pr-3 py-2 rounded-md bg-[#D4DEFB] text-sm outline-none w-48 lg:w-64"
            />

            <button
              onClick={() => router.push(`/projects/${projectId}/epics/create`)}
              className="bg-[#014CBF] text-white px-4 py-2 rounded-md text-sm whitespace-nowrap"
            >
              + New Epic
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
          {epics.length > 0 ? (
            epics.map((epic) => {
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
                  className="bg-white border-l-4 border-blue-600 rounded-xl p-4 shadow-sm cursor-pointer"
                >
                  <span className="text-xs text-blue-600">{epic.epic_id}</span>

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
            })
          ) : (
            <div className="col-span-full text-center mt-10 text-gray-500">
              No epics found for this project
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="hidden lg:block">
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            limit={limit}
            onPageChange={setCurrentPage}
            label="epics"
          />
        </div>

        {loadingMore && (
          <div className="text-center text-gray-500 py-4">Loading more...</div>
        )}

        <div ref={loaderRef} className="h-10" />
      </div>

      {/* MODAL */}
      <EpicDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        epicId={selectedEpicId}
        projectId={projectId}
        onUpdateEpic={handleUpdateEpic}
      />

      {/* FLOAT BUTTON */}
      <button
        onClick={() => router.push(`/projects/${projectId}/epics/create`)}
        className="lg:hidden fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#014CBF] text-white"
      >
        +
      </button>
    </div>
  );
}
