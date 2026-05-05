"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import TaskDetailsModal from "@/app/(dashboard)/projects/[projectId]/tasks/modal";
import Pagination from "../paginations";
import { useDebounce } from "@/app/hooks/useDebounce";

import { getProjectTasks } from "@/app/services/tasks.service";

export default function TaskList({ search }) {
  const { projectId } = useParams();
  const router = useRouter();

  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [mobilePage, setMobilePage] = useState(1);
  const [desktopPage, setDesktopPage] = useState(1);

  const limit = 5;

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 1024;

  const page = isMobile ? mobilePage : desktopPage;

  const debouncedSearch = useDebounce(search, 500);

 
  const { data, isLoading } = useQuery({
    queryKey: ["tasks", projectId, debouncedSearch],
    queryFn: () =>
      getProjectTasks({
        projectId,
        search: debouncedSearch,
      }),
    enabled: !!projectId,
  });

  const allTasks = data?.data || [];

  // =========================
  // Client-side pagination
  // =========================
  const tasks = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return allTasks.slice(start, end);
  }, [allTasks, page]);

  const totalCount = allTasks.length;

  // =========================
  // handlers
  // =========================
  const openTask = (taskId) => {
    if (!taskId) return;
    setSelectedTaskId(taskId);
    setIsOpen(true);
  };

  const goToCreateTask = () => {
    router.push(`/project/${projectId}/tasks/create`);
  };

  return (
    <div className="p-6 bg-[#F9F9FF] min-h-screen">
      {/* ADD BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center mb-6 gap-3 lg:justify-end">
        <button
          onClick={goToCreateTask}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm w-full sm:w-auto"
        >
          + Add Task
        </button>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden space-y-4">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.task_id}
              onClick={() => openTask(task.id)}
              className="bg-white p-4 rounded-xl shadow-sm cursor-pointer"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-gray-400">
                  TASK-{task.task_id}
                </span>

                <span className="text-[10px] px-2 py-1 rounded bg-blue-100 text-blue-600">
                  {task.status}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                {task.title}
              </h3>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block bg-white rounded-xl overflow-hidden">
        <div className="grid grid-cols-6 text-sm font-semibold p-3 bg-gray-50">
          <div>Task</div>
          <div>Title</div>
          <div>Status</div>
          <div>Due Date</div>
          <div>Assignee</div>
          <div className="text-right">Settings</div>
        </div>

        {isLoading ? (
          <p className="p-4 text-sm text-gray-500">Loading...</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.task_id}
              onClick={() => openTask(task.id)}
              className="grid grid-cols-6 items-center p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
            >
              <div className="text-xs text-blue-600 font-medium">
                {task.task_id}
              </div>

              <div className="text-sm text-gray-800">{task.title}</div>

              <div>
                <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-600">
                  {task.status}
                </span>
              </div>

              <div className="text-xs text-gray-600">
                {task.due_date
                  ? new Date(task.due_date).toLocaleDateString()
                  : "-"}
              </div>

              <div className="text-xs text-gray-600">
                {task.assignee?.name || "Unassigned"}
              </div>

              <div className="flex justify-end">...</div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={page}
        totalCount={totalCount}
        limit={limit}
        onPageChange={(p) => {
          isMobile ? setMobilePage(p) : setDesktopPage(p);
        }}
        label="tasks"
      />

      {/* MODAL */}
      <TaskDetailsModal
        taskId={selectedTaskId}
        projectId={projectId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}