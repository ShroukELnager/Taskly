"use client";

import { useEffect, useState } from "react";
import { getTaskDetails } from "@/app/api/getTaskDetails";

export default function TaskDetailsModal({
  isOpen,
  onClose,
  projectId,
  taskId,
}) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(false);

        const data = await getTaskDetails(projectId, taskId);
        setTask(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [isOpen, projectId, taskId]);

  // ✅ ESC close handler
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    const s = status?.toUpperCase();

    if (s === "TO_DO") return "bg-gray-200 text-gray-700";
    if (s === "IN_PROGRESS") return "bg-blue-200 text-blue-700";
    if (s === "DONE") return "bg-green-200 text-green-700";
    if (s === "BLOCKED") return "bg-red-200 text-red-700";
    if (s === "IN_REVIEW") return "bg-purple-200 text-purple-700";
    if (s === "READY_FOR_QA") return "bg-yellow-200 text-yellow-800";

    return "bg-gray-100 text-gray-600";
  };

  const getInitials = (name = "") => {
    const parts = name.split(" ");
    if (parts.length === 1) return name.slice(0, 2).toUpperCase();
    return parts
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
  <div
    onClick={onClose}
    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
  />

  {/* MODAL WRAPPER */}
  <div
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}
    className="fixed inset-0 z-50 flex items-start md:items-center justify-center overflow-y-auto p-4 md:p-0"
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="
        w-full md:w-[900px]
        max-h-[90vh]
        bg-white
        md:rounded-xl rounded-2xl
        shadow-xl overflow-hidden
      "
    >
      {loading ? (
        <div className="p-6 text-center">Loading...</div>
      ) : error ? (
        <div className="p-6 text-red-500 text-center">
          Failed to load task details
        </div>
      ) : !task ? (
        <div className="p-6 text-center">Task not found</div>
      ) : (
        <div className="overflow-y-auto max-h-[90vh]">
          
          {/* HEADER (موبايل بس) */}
          <div className="p-4 border-b md:hidden">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold bg-blue-100 text-[#003D9B] px-2 py-1 rounded-md">
                {task.task_id}
              </span>

              <button onClick={onClose} className="text-gray-500 text-lg">
                ✕
              </button>
            </div>

            <h2 className="text-lg font-bold">{task.title}</h2>

            <span
              className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${getStatusStyle(
                task.status,
              )}`}
            >
              {task.status}
            </span>
          </div>

          {/* DESKTOP LAYOUT */}
          <div className="hidden md:grid grid-cols-3">
            <div className="col-span-2 p-6">
              <div className="mb-6">
                <span className="inline-block px-3 text-sm font-semibold bg-blue-100 text-[#003D9B] rounded-md mb-2">
                  {task.task_id}
                </span>

                <h2 className="text-2xl font-bold border-b border-gray-200 pb-2 mb-4">
                  {task.title}
                </h2>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {task.description || "No description"}
              </p>
            </div>

            <div className="p-6 bg-[#F1F3FF] space-y-6">
              <div>
                <p className="text-xs text-gray-400 mb-1">STATUS</p>
                <span
                  className={`block w-full px-3 py-2 rounded-md text-sm font-medium ${getStatusStyle(
                    task.status,
                  )}`}
                >
                  {task.status}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2">ASSIGNEE</p>
                {task.assignee ? (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                      {getInitials(task.assignee.name)}
                    </div>

                    <div>
                      <p className="font-medium text-sm">
                        {task.assignee.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {task.assignee.department || "No department"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">Unassigned</span>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">REPORTER</p>
                <span>{task.created_by?.name || "-"}</span>
              </div>

              <div className="flex justify-between">
                <p className="text-xs text-gray-400">DUE DATE</p>
                <span className="text-sm">{formatDate(task.due_date)}</span>
              </div>

              <div className="flex justify-between">
                <p className="text-xs text-gray-400">CREATED AT</p>
                <span className="text-sm">
                  {formatDate(task.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* MOBILE LAYOUT */}
          <div className="p-4 space-y-4 md:hidden">
            <div className="grid grid-cols-2 gap-3">
              <MobileCard label="ASSIGNEE">
                {task.assignee?.name || "Unassigned"}
              </MobileCard>

              <MobileCard label="DUE DATE">
                {formatDate(task.due_date)}
              </MobileCard>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <MobileCard label="CREATED BY">
                {task.created_by?.name || "-"}
              </MobileCard>

              <MobileCard label="CREATED AT">
                {formatDate(task.created_at)}
              </MobileCard>
            </div>

            <MobileCard label="DESCRIPTION" full>
              {task.description || "No description"}
            </MobileCard>
          </div>

          {/* FOOTER */}
          <div className="flex justify-center p-4 bg-[#F1F3FF]">
            <button
              onClick={onClose}
              className="hidden md:block w-auto px-6 py-2 bg-[#D7E2FF] text-[#041B3C] rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
</>
  );
}
function MobileCard({ label, children, full }) {
  return (
    <div className={`bg-gray-50 rounded-xl p-3 ${full ? "col-span-2" : ""}`}>
      <p className="text-[10px] text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-medium">{children}</p>
    </div>
  );
}
