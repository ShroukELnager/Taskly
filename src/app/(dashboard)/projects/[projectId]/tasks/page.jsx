"use client";
import TaskBoard from "@/app/components/taskBoard/taskBoard";
import TaskList from "@/app/components/taskList/tasksList";
import Image from "next/image";
import React, { useState } from "react";

export default function Tasks() {
  const [view, setView] = useState("board");
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="max-w-5xl px-2">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
  
  {/* TITLE */}
  <div className="text-center lg:text-left w-full">
    <h1 className="text-xl font-semibold">
      Active Workboard
    </h1>

    <p className="hidden lg:block text-sm text-gray-500">
      Curating project tasks by status
    </p>
  </div>

  <div className="flex flex-col items-center lg:flex-row lg:items-center gap-3 w-full lg:w-auto">
    
    <div className="flex items-center bg-[#e9eef8] px-3 py-2 rounded-lg w-full max-w-md lg:w-64">
      <Image
        src="/images/search.svg"
        alt="Search"
        width={16}
        height={16}
      />
      <input
        placeholder="Search tasks"
        className="bg-transparent outline-none ml-2 text-sm w-full"
      />
    </div>

    <div className="hidden lg:flex items-center gap-3">
      <div className="relative w-[160px]">
        <div
          onClick={() => setOpen(!open)}
          className="bg-white px-3 py-2 rounded-lg text-sm flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Image
              src={
                view === "board"
                  ? "/images/list.png"
                  : "/images/menu.png"
              }
              width={14}
              height={14}
              alt="view"
            />
            <span>
              {view === "board" ? "Board View" : "List View"}
            </span>
          </div>
        </div>

        {open && (
          <div className="absolute mt-2 w-full bg-white border rounded-lg shadow z-10">
            <div
              onClick={() => {
                setView("board");
                setOpen(false);
              }}
              className="px-3 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
            >
              <Image src="/images/list.png" width={14} height={14} alt="" />
              Board View
            </div>

            <div
              onClick={() => {
                setView("list");
                setOpen(false);
              }}
              className="px-3 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
            >
              <Image src="/images/menu.png" width={14} height={14} alt="" />
              List View
            </div>
          </div>
        )}
      </div>

      <button className="bg-[#e9eef8] p-2 rounded-lg">
        <Image
          src="/images/filter.png"
          alt="Filter"
          width={19}
          height={19}
        />
      </button>
    </div>
  </div>
</div>
      </div>

      <div className="block lg:hidden">
        <TaskList />
      </div>

      <div className="hidden lg:block">
        {view === "board" ? <TaskBoard /> : <TaskList />}
      </div>
    </>
  );
}