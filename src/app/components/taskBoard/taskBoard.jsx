"use client";

import TaskColumn from "@/app/components/taskColumns/taskcolumns";
import { useState } from "react";
import { useParams } from "next/navigation";
import { DndContext } from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "@/app/services/tasks.service";

function getTaskId(task) {
  const id = task?.id ?? task?.task_id;
  return id == null ? null : String(id);
}

function getTaskList(queryData) {
  return Array.isArray(queryData) ? queryData : queryData?.data;
}

function setTaskList(queryData, tasks) {
  return Array.isArray(queryData) ? tasks : { ...queryData, data: tasks };
}

const STATUSES = [
  "TO_DO",
  "IN_PROGRESS",
  "BLOCKED",
  "IN_REVIEW",
  "READY_FOR_QA",
  "REOPENED",
  "READY_FOR_PRODUCTION",
  "DONE",
];

export default function TaskBoard({ search }) {
  const { projectId } = useParams();
  const queryClient = useQueryClient();
  const [mutationError, setMutationError] = useState("");

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, status, task }) =>
      updateTask(taskId, {
        status,
        id: task?.id,
        task_id: task?.task_id,
      }),

    onMutate: async ({ taskId, status, task }) => {
      setMutationError("");

      await queryClient.cancelQueries({
        queryKey: ["tasks", projectId],
      });

      const queryKey = ["tasks", projectId];
      queryClient.setQueryData(queryKey, (old) => {
        const tasks = getTaskList(old);
        if (!tasks) return old;

        const nextTasks = tasks.map((item) =>
          getTaskId(item) === String(taskId) ? { ...item, status } : item
        );

        if (nextTasks.some((item) => getTaskId(item) === String(taskId))) {
          return setTaskList(old, nextTasks);
        }

        return setTaskList(old, [
          ...nextTasks,
          { ...(task || {}), id: taskId, status },
        ]);
      });

      return { queryKey };
    },

    onError: (err) => {
      const message = err?.message || "Failed to update task status";

      setMutationError(message);
    },

    onSuccess: (data, variables) => {
      const updatedTask = Array.isArray(data) ? data[0] : data;

      if (!updatedTask) return;

      queryClient.setQueryData(["tasks", projectId], (old) => {
        const tasks = getTaskList(old);
        if (!tasks) return old;

        const nextTasks = tasks.map((task) =>
          getTaskId(task) === String(variables.taskId)
            ? { ...task, ...updatedTask }
            : task
        );

        return setTaskList(old, nextTasks);
      });
    },
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = String(active.id);
    const newStatus = over.id;
    const task = active.data.current?.task;

    if (!STATUSES.includes(newStatus) || task?.status === newStatus) return;

    updateTaskMutation.mutate({
      taskId,
      status: newStatus,
      task,
    });
  };

  return (
<DndContext onDragEnd={handleDragEnd}>
  <div className="p-2 bg-[#F9F9FF] min-h-screen w-full overflow-x-auto overflow-y-visible">
    {mutationError && (
      <div className="sticky left-0 mb-3 w-fit max-w-full rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
        {mutationError}
      </div>
    )}
    <div className="flex gap-4 w-max">
      {STATUSES.map((status) => (
        <TaskColumn
          key={status}
          status={status}
          projectId={projectId}
          search={search}
        />
      ))}
    </div>
  </div>
</DndContext>
  );
}
