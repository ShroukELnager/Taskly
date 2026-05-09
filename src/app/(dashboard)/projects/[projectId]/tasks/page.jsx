"use client";
import TaskBoard from "@/app/components/taskBoard/taskBoard";
import TaskList from "@/app/components/taskList/tasksList";
import Image from "next/image";
import React, { useState } from "react";

export default function Tasks() {
  const [view, setView] = useState("board");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  return (
    <>
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full text-center lg:text-left">
            <h1 className="text-2xl font-semibold">Active Workboard</h1>

            <p className="hidden lg:block text-sm text-gray-500">
              Curating project tasks by status
            </p>
          </div>

          <div className="flex w-full flex-col items-stretch gap-3 sm:items-center lg:w-auto lg:flex-row lg:items-center">
            <div className="flex w-full items-center rounded-lg bg-[#e9eef8] px-3 py-2 sm:max-w-md lg:w-72 xl:w-80">
              <Image
                src="/images/search.svg"
                alt="Search"
                width={16}
                height={16}
              />
              <input
                placeholder="Search tasks"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                    <span>{view === "board" ? "Board View" : "List View"}</span>
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
                      <Image
                        src="/images/list.png"
                        width={14}
                        height={14}
                        alt=""
                      />
                      Board View
                    </div>

                    <div
                      onClick={() => {
                        setView("list");
                        setOpen(false);
                      }}
                      className="px-3 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <Image
                        src="/images/menu.png"
                        width={14}
                        height={14}
                        alt=""
                      />
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

      <div className="hidden w-full min-w-0 lg:block">
        {view === "board" ? (
          <div className="mx-auto w-full max-w-[1500px] min-w-0 overflow-x-auto">
            <TaskBoard search={search} />
          </div>
        ) : (
          <TaskList search={search} />
        )}
      </div>
    </>
  );
}
