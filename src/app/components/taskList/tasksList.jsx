"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";
import TaskDetailsModal from "@/app/(dashboard)/projects/[projectId]/tasks/modal";

export default function TaskList() {
  const { projectId } = useParams();
  const router = useRouter();
const [selectedTaskId, setSelectedTaskId] = useState(null);
const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("access_token");



const openTask = (taskId) => {
  if (!taskId) return;
  setSelectedTaskId(taskId);
  setIsOpen(true);
};

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/project_tasks?project_id=eq.${projectId}`,
          {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  const goToCreateTask = () => {
    router.push(`/project/${projectId}/tasks/new`);
  };

  return (
    <div className="p-6 bg-[#F9F9FF] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center mb-6 gap-3 lg:justify-end">
        <button
          onClick={goToCreateTask}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm w-full sm:w-auto"
        >
          + Add Task
        </button>
      </div>

      <div className="lg:hidden space-y-4">
        {loading ? (
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

                <span
                  className={`text-[10px] px-2 py-1 rounded font-semibold
                    ${
                      task.status === "DONE"
                        ? "bg-green-100 text-green-600"
                        : task.status === "REVIEW"
                          ? "bg-blue-100 text-blue-600"
                          : task.status === "URGENT"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {task.status}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                {task.title}
              </h3>

              <div className="flex justify-between items-start text-xs text-gray-500">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
                      {task.assignee?.name
                        ? task.assignee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : "UN"}
                    </div>

                    <span>{task.assignee?.name || "Unassigned"}</span>
                  </div>

                  {/* DATE UNDER ASSIGNEE */}
                  <span className="text-[11px] text-gray-400 pl-8">
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })
                      : "-"}
                  </span>
                </div>

                <span className="text-lg mr-4 leading-none cursor-pointer">
                  ...
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP (UNCHANGED) */}
      <div className="hidden lg:block bg-white rounded-xl overflow-hidden">
        <div className="grid grid-cols-6 text-sm font-semibold p-3 bg-gray-50">
          <div>Task</div>
          <div>Title</div>
          <div>Status</div>
          <div>Due Date</div>
          <div>Assignee</div>
          <div className="text-right">Settings</div>
        </div>

        {loading ? (
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

              <div className="text-xs text-gray-600 flex items-center gap-1">
                <Image
                  src="/images/date.png"
                  alt="date"
                  width={12}
                  height={12}
                />
                {task.due_date
                  ? new Date(task.due_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : "-"}
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
                  {task.assignee?.name
                    ? task.assignee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "UN"}
                </div>

                <span className="text-xs text-gray-600">
                  {task.assignee?.name || "Unassigned"}
                </span>
              </div>

              <div className="flex justify-end">...</div>
            </div>
          ))
        )}
      </div>
      <TaskDetailsModal
  taskId={selectedTaskId}
  projectId={projectId}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
    </div>
  );
}
