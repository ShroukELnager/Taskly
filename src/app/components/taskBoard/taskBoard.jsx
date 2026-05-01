"use client";

import TaskColumn from "@/app/components/taskColumns/taskcolumns";
import Image from "next/image";
import { useParams } from "next/navigation";
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

export default function TaskBoard() {
  const { projectId } = useParams();

  return (
    <div className="p-2 bg-[#F9F9FF] min-h-screen">
      <div className="max-w-5xl  px-4">
       
      </div>

      <div className="flex gap-4 overflow-x-auto">
        {STATUSES.map((status) => (
          <TaskColumn key={status} status={status} projectId={projectId} />
        ))}
      </div>
    </div>
  );
}
