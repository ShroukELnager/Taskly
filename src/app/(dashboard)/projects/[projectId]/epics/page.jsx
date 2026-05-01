"use client";

import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";

import EmptyEpics from "@/app/components/emptyPages/epics";
import EpicsError from "@/app/components/errorsPages/epics";
import EpicsSkeleton from "@/app/components/skeleton/epics";
import EpicDetailsModal from "./modale";
import Pagination from "@/app/components/paginations";

export default function EpicsPage() {
  const { projectId } = useParams();
  const router = useRouter();

  const [loadingMore, setLoadingMore] = useState(false);

  const [epics, setEpics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedEpicId, setSelectedEpicId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const limit = 6;

  const loaderRef = useRef(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
      setEpics([]);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchEpics = async (page = currentPage, append = false) => {
    try {
      setLoading(true);
      setError("");

      if (append) setLoadingMore(true);

      const token = Cookies.get("access_token");
      const offset = (page - 1) * limit;

      let url = `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/project_epics?project_id=eq.${projectId}&limit=${limit}&offset=${offset}`;

      if (debouncedSearch) {
        url += `&title=ilike.%25${debouncedSearch}%25`;
      }

      const res = await fetch(url, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Prefer: "count=exact",
        },
      });

      if (!res.ok) throw new Error("Failed to search epics");

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
      setError("Failed to search epics");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchEpics();
  }, [projectId, currentPage, debouncedSearch]);

  const handleUpdateEpic = (updatedEpic) => {
    setEpics((prev) =>
      prev.map((epic) => (epic.id === updatedEpic.id ? updatedEpic : epic)),
    );
  };

  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const nextPage = currentPage + 1;
          const hasMore = epics.length < totalCount;

          if (hasMore && !loadingMore) {
            setCurrentPage(nextPage);
            fetchEpics(nextPage, true);
          }
        }
      },
      { threshold: 1 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [currentPage, epics, totalCount, debouncedSearch, loadingMore]);

  if (loading && epics.length === 0) return <EpicsSkeleton />;

  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center pb-24 sm:pb-10">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 pt-4">
          <h1 className="text-2xl font-semibold hidden lg:block">
            Project Epics
          </h1>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <input
              type="text"
              placeholder="Search epics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="hidden lg:block pl-3 pr-3 py-2 rounded-md bg-[#D4DEFB] text-sm outline-none"
            />

            <button
              onClick={() => router.push(`/projects/${projectId}/epics/create`)}
              className="hidden lg:flex bg-[#014CBF] text-white px-4 py-2 rounded-md text-sm"
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
              {debouncedSearch
                ? "No epics found matching your search"
                : "No epics found for this project"}
            </div>
          )}
        </div>

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

      <EpicDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        epicId={selectedEpicId}
        projectId={projectId}
        onUpdateEpic={handleUpdateEpic}
      />

      <button
        onClick={() => router.push(`/projects/${projectId}/epics/create`)}
        className="lg:hidden fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#014CBF] text-white"
      >
        +
      </button>
    </div>
  );
}
