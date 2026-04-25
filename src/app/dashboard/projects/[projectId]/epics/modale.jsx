"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";

export default function EpicDetailsModal({
  isOpen,
  onClose,
  epicId,
  projectId,
}) {
  const [epic, setEpic] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDetails = async () => {
    if (!epicId) return;

    try {
      setLoading(true);

      const token = Cookies.get("access_token");

      const res = await fetch(
        `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/project_epics?project_id=eq.${projectId}&id=eq.${epicId}`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setEpic(data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchDetails();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50"
    >
      <div className="w-full sm:max-w-3xl sm:px-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className="
            bg-white 
            w-full 
            h-[95vh] sm:h-auto 
            rounded-t-2xl sm:rounded-2xl 
            shadow-lg 
            overflow-y-auto
          "
        >
          <div className="p-5 sm:p-6 relative">
            <button
              onClick={onClose}
              className="absolute right-5 top-5"
            >
              <Image
                src="/images/close.png"
                width={18}
                height={18}
                alt="close"
              />
            </button>

            {loading ? (
              <p className="text-center py-10">Loading...</p>
            ) : epic ? (
              <>
                {/* HEADER */}
                <div className="mb-5">
                  <p className="text-xs font-semibold text-blue-600 mb-1">
                    {epic.epic_id}
                  </p>

                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    {epic.title}
                  </h2>
                </div>

                <div className="mb-5">
                  <p className="text-xs text-gray-400 uppercase mb-1">
                    Description
                  </p>

                  <p className="text-sm text-gray-500">
                    {epic.description?.trim()
                      ? epic.description
                      : "No description provided"}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 text-sm mb-6">
                  <div>
                    <p className="text-gray-400 text-xs uppercase mb-1">
                      Created By
                    </p>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold">
                        {epic.created_by?.name
                          ?.split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2) || "—"}
                      </div>

                      <p className="font-medium text-sm">
                        {epic.created_by?.name || "—"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs uppercase mb-1">
                      Assignee
                    </p>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-xs font-semibold">
                        {epic.assignee?.name
                          ?.split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2) || "NA"}
                      </div>

                      <p className="font-medium text-sm">
                        {epic.assignee?.name || "Unassigned"}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-gray-400 text-xs uppercase mb-1">
                      Created At
                    </p>

                    <div className="flex items-center gap-2">
                      <Image
                        src="/images/date.png"
                        width={16}
                        height={16}
                        alt="date"
                      />

                      <p className="font-medium text-sm">
                        {new Date(epic.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">Tasks</h3>

                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    0 TASKS
                  </span>
                </div>

                <div className="border border-dashed rounded-xl p-8 sm:p-10 text-center bg-gray-50">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Image
                        src="/images/menu.png"
                        width={22}
                        height={22}
                        alt="menu"
                      />
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm mb-4 max-w-xs mx-auto">
                    No tasks have been added to this epic yet
                  </p>

                  <button className="bg-[#0B5ED7] hover:bg-[#0a53c1] text-white px-5 py-2 rounded-md text-sm font-medium">
                    + Add Task
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center py-10">No Data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}