"use client";

import { useDraggable } from "@dnd-kit/core";
import Image from "next/image";

export default function TaskCard({ task, openTask }) {
  const taskId = task.id ?? task.task_id;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: taskId,
    data: { task },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
      onClick={(e) => {
        e.stopPropagation();
        openTask(taskId);
      }}
      className="bg-white p-3 rounded-xl shadow-sm cursor-pointer"
    >
      <p className="text-sm font-medium mb-2">{task.title}</p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        {task.due_date && (
          <span className="flex items-center gap-1">
            <Image src="/images/date.png" width={12} height={12} alt="" />
            {new Date(task.due_date).toLocaleDateString()}
          </span>
        )}

        <span className="bg-blue-500 w-6 h-6 flex items-center justify-center rounded-full text-[10px] text-white font-bold">
          {task.assignee?.name?.slice(0, 2)}
        </span>
      </div>
    </div>
  );
}
