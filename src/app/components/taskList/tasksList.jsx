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

  const allTasks = useMemo(() => data?.data || [], [data?.data]);


  const tasks = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return allTasks.slice(start, end);
  }, [allTasks, page]);

  const totalCount = allTasks.length;

  
  const openTask = (taskId) => {
    if (!taskId) return;
    setSelectedTaskId(taskId);
    setIsOpen(true);
  };

  const goToCreateTask = () => {
    router.push(`/projects/${projectId}/tasks/create`);
  };

  return (
    <div className="mx-auto w-full max-w-[1500px] bg-[#F9F9FF] py-4">
      <div className="flex flex-col sm:flex-row sm:items-center mb-6 gap-3 lg:justify-end">
        <button
          onClick={goToCreateTask}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm w-full sm:w-auto"
        >
          + Add Task
        </button>
      </div>

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

      <div className="hidden overflow-x-auto rounded-lg bg-white lg:block">
        <div className="min-w-[900px]">
        <div className="grid grid-cols-6 bg-gray-50 p-3 text-sm font-semibold">
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
      </div>

      <Pagination
        currentPage={page}
        totalCount={totalCount}
        limit={limit}
        onPageChange={(p) => {
          isMobile ? setMobilePage(p) : setDesktopPage(p);
        }}
        label="tasks"
      />

      <TaskDetailsModal
        taskId={selectedTaskId}
        projectId={projectId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
