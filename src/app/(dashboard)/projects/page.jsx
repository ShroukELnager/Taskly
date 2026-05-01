"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import SkeletonCard from "@/app/components/skeleton/projects";
import EpicsError from "@/app/components/errorsPages/epics";
import EmptyProjects from "@/app/components/emptyPages/project";
import Pagination from "@/app/components/paginations";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");

  const isFetching = useRef(false);

  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const limit = 5;
  const router = useRouter();

  const fetchProjects = async (page = 1, append = false) => {
    if (isFetching.current) return;

    isFetching.current = true;

    if (append) setLoadingMore(true);
    else setLoading(true);

    setError("");

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];

    try {
      const offset = (page - 1) * limit;

      const res = await fetch(
        `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/rpc/get_projects?limit=${limit}&offset=${offset}`,
        {
          method: "GET",
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Prefer: "count=exact",
          },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch projects");

      const data = await res.json();

      const contentRange = res.headers.get("Content-Range");
      const total = contentRange?.split("/")[1];

      setTotalCount(Number(total));

      if (append) {
        setProjects((prev) => [...prev, ...data]);
      } else {
        setProjects(data);
      }

      const nextOffset = page * limit;
      setHasMore(nextOffset < Number(total));
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchProjects(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth < 640;
      if (!isMobile) return;

      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight
      ) {
        if (!loadingMore && hasMore) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          fetchProjects(nextPage, true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPage, hasMore, loadingMore]);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center pb-24 sm:pb-10">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="p-4 flex justify-between items-center flex-col sm:flex-row gap-4 sm:gap-0">
          <div className="text-center sm:text-left w-full">
            <h1 className="font-semibold text-3xl">Projects</h1>
            <p className="text-gray-600 text-sm">
              Manage and create your projects
            </p>
          </div>

          <button
            onClick={() => router.push("/projects/create")}
            className="hidden sm:flex bg-[#014CBF] text-white py-2 px-4 rounded-md hover:bg-blue-600 items-center gap-2 whitespace-nowrap"
          >
            <Image src="/images/plus.svg" alt="plus" width={16} height={16} />
            <p className="text-sm font-medium whitespace-nowrap">
              Create Project
            </p>
          </button>
        </div>

        {error && (
          <div className="p-4">
            <EpicsError fetchEpics={fetchProjects} />
          </div>
        )}

        {loading && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <EmptyProjects />
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => router.push(`/projects/${project.id}/epics`)}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md hover:scale-105 transition cursor-pointer"
                >
                  <h2 className="text-lg font-semibold text-gray-900">
                    {project.name || "Untitled Project"}
                  </h2>

                  <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                    {project.description || "No description available"}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/projects/${project.id}/edit`);
                    }}
                    className="mt-4 text-sm bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition"
                  >
                    Edit
                  </button>

                  <div className="mt-6 flex justify-between items-center text-xs text-gray-400">
                    <span>CREATED AT</span>
                    <span>
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}

              <div className="bg-white border border-dashed hover:scale-105 hover:shadow-md rounded-xl p-5 flex flex-col justify-between cursor-pointer hover:bg-gray-50">
                <div
                  onClick={() => router.push("/projects/create")}
                  className="flex flex-col items-center justify-center h-full text-center text-gray-500"
                >
                  <div className="w-[40px] h-[40px] bg-[#E5EEFA] rounded-lg flex items-center justify-center">
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

            <div className="hidden sm:block px-4 pb-20">
              <Pagination
                currentPage={currentPage}
                totalCount={totalCount}
                limit={limit}
                onPageChange={setCurrentPage}
                label="projects"
              />
            </div>

            {loadingMore && (
              <p className="text-center text-gray-500 pb-10">Loading more...</p>
            )}
          </>
        )}
      </div>

      <button
        onClick={() => router.push("/projects/create")}
        className="sm:hidden fixed bottom-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-[#014CBF] text-white shadow-lg hover:bg-blue-600 transition z-50"
      >
        <Image src="/images/plus.svg" alt="plus" width={20} height={20} />
      </button>
    </div>
  );
}
