"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchTasksByStatus } from "@/app/api/fetchTasks";
import Image from "next/image";
import TaskDetailsModal from "@/app/(dashboard)/projects/[projectId]/tasks/modal";

export default function TaskColumn({ status, projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const STATUS_STYLES = {
    TO_DO: "bg-gray-400 text-gray-600",
    IN_PROGRESS: "bg-blue-500 text-blue-600",
    BLOCKED: "bg-red-500 text-red-600",
    IN_REVIEW: "bg-purple-500 text-purple-600",
    READY_FOR_QA: "bg-yellow-500 text-yellow-600",
    REOPENED: "bg-orange-500 text-orange-600",
    READY_FOR_PRODUCTION: "bg-indigo-500 text-indigo-600",
    DONE: "bg-green-500 text-green-600",
  };

  const router = useRouter();

  useEffect(() => {
    let ignore = false;

    async function loadTasks() {
      try {
        setLoading(true);
        const data = await fetchTasksByStatus(projectId, status);

        if (!ignore) {
          setTasks(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadTasks();

    return () => {
      ignore = true;
    };
  }, [projectId, status]);

  const goToCreate = () => {
    router.push(
      `/projects/${projectId}/tasks/create?status=${encodeURIComponent(status)}`,
    );
  };

  // ✅ فتح المودال
  const openTask = (taskId) => {
    setSelectedTaskId(taskId);
    setIsOpen(true);
  };

  return (
    <div className="min-w-[270px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
          <span
            className={`w-2 h-2 rounded-full ${STATUS_STYLES[status]?.split(" ")[0]}`}
          ></span>{" "}
          {status}
          <span className="bg-gray-200 px-2 py-0.5 rounded text-[10px]">
            {tasks.length}
          </span>
        </div>

        <button onClick={goToCreate}>+</button>
      </div>

      <div
        onClick={goToCreate}
        className="border border-dashed rounded-lg py-3 flex items-center justify-center gap-2 text-xs text-gray-400 mb-3 cursor-pointer hover:bg-gray-100"
      >
        <Image src="/images/Cplus.png" width={16} height={16} alt="Add Task" />
        <span>ADD NEW TASK</span>
      </div>

      {loading ? (
        <div className="text-xs text-gray-400">Loading...</div>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <div
              key={task.task_id}
              onClick={() => openTask(task.id)}   // ✅ فتح المودال عند الضغط
              className="bg-white p-3 rounded-xl shadow-sm cursor-pointer"
            >
              <p className="text-sm font-medium mb-2">{task.title}</p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                {task.due_date && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Image
                      src="/images/date.png"
                      alt="Calendar"
                      width={12}
                      height={12}
                    />
                    {new Date(task.due_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}

                {task.status === "BLOCKED" && (
                  <span className="text-red-500">
                    <Image
                      src="/images/block.png"
                      width={12}
                      height={12}
                      alt="Warning"
                    />{" "}
                    DELAYED
                  </span>
                )}

                <span className="bg-blue-500 w-6 h-6 flex items-center justify-center rounded-full text-[10px] text-white font-bold">
                  {task.assignee.name?.slice(0, 2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ المودال */}
      <TaskDetailsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        taskId={selectedTaskId}
        projectId={projectId}
      />
    </div>
  );
}