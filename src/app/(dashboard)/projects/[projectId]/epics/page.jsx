"use client";

import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import EpicsSkeleton from "@/app/components/skeleton/epics";
import EpicDetailsModal from "./modale";
import Pagination from "@/app/components/paginations";
import { useDebounce } from "@/app/hooks/useDebounce";

import { getEpics } from "@/app/services/epics.service";

export default function EpicsPage() {
  const { projectId } = useParams();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedEpicId, setSelectedEpicId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const limit = 6;

  const loaderRef = useRef(null);
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 1024;

  // =========================
  // REACT QUERY (SOURCE OF TRUTH)
  // =========================
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["epics", projectId, currentPage, debouncedSearch],
    queryFn: () =>
      getEpics({
        projectId,
        page: currentPage,
        limit,
        search: debouncedSearch,
      }),
    keepPreviousData: true,
  });


  const epics = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const loadingMore = isFetching && currentPage > 1;


  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // safe event-driven reset
  };


  const observerRef = (node) => {
    if (!isMobile) return;
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const hasMore = epics.length < totalCount;

        if (hasMore && !loadingMore) {
          setCurrentPage((prev) => prev + 1);
        }
      }
    });

    observer.observe(node);

    return () => observer.disconnect();
  };


  const handleUpdateEpic = () => {
    refetch();
  };

  if (isLoading && epics.length === 0) return <EpicsSkeleton />;

  if (isError)
    return (
      <div className="text-center text-red-500 mt-10">
        {error.message}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center pb-24 sm:pb-10">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">

      <div className="flex items-center justify-between mb-6 pt-4">
  <h1 className="text-2xl font-semibold hidden lg:block">
    Project Epics
  </h1>

  <div className="flex items-center gap-3">
    <input
      type="text"
      value={search}
      onChange={handleSearchChange}
      placeholder="Search epics..."
      className="pl-3 pr-3 py-2 rounded-md bg-[#D4DEFB] text-sm outline-none"
    />

    <button
      onClick={() =>
        router.push(`/projects/${projectId}/epics/create`)
      }
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
                  onClick={() => {
                    setSelectedEpicId(epic.id);
                    setIsModalOpen(true);
                  }}
                  className="bg-white border-l-4 border-blue-600 rounded-xl p-4 shadow-sm cursor-pointer"
                >
                  <span className="text-xs text-blue-600">
                    {epic.epic_id}
                  </span>

                  <h2 className="mt-2 font-semibold">
                    {epic.title}
                  </h2>

                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-lg">
                      {initials}
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Assignee
                      </p>
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
          <div className="text-center text-gray-500 py-4">
            Loading more...
          </div>
        )}

        <div ref={observerRef} className="h-10" />
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
          router.push(`/projects/${projectId}/epics/create`)
        }
        className="lg:hidden fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#014CBF] text-white"
      >
        +
      </button>
    </div>
  );
}