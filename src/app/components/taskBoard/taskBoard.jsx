"use client";

import TaskColumn from "@/app/components/taskColumns/taskcolumns";
import { useParams } from "next/navigation";
import { DndContext } from "@dnd-kit/core";
import Cookies from "js-cookie";
import { useState } from "react";

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

  const [refreshKey, setRefreshKey] = useState(0);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    try {
      const token = Cookies.get("access_token");

      await fetch(
        `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/tasks?id=eq.${taskId}`,
        {
          method: "PATCH",
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      // refresh board after move
      setRefreshKey((p) => p + 1);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="p-2 bg-[#F9F9FF] min-h-screen overflow-x-auto">
        <div className="flex gap-4">

          {STATUSES.map((status) => (
            <TaskColumn
              key={status + refreshKey}
              status={status}
              projectId={projectId}
              search={search}   // 👈 مهم جدًا
            />
          ))}

        </div>
      </div>
    </DndContext>
  );
}