"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import toast from "react-hot-toast";

/* ================= VALIDATION SCHEMA ================= */
const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  assignee_id: z.string().optional(),
  deadline: z.string().optional(),
});

export default function CreateEpic() {
  const router = useRouter();
  const { projectId } = useParams();

  /* ================= STATE ================= */
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  /* ================= REACT HOOK FORM ================= */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  /* ================= FETCH MEMBERS ================= */
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("access_token="))
          ?.split("=")[1];

        const res = await fetch(
          `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/get_project_members?project_id=eq.${projectId}`,
          {
            method: "GET",
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        setMembers(data || []);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load members");
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [projectId]);

  /* ================= SUBMIT ================= */
  const onSubmit = async (data) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

      const res = await fetch(
        `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/epics?project_id=eq.${projectId}`,
        {
          method: "POST",
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            
          },
         body: JSON.stringify({
  title: data.title,
  description: data.description || "",
  assignee_id: "1fae3877-e08b-4eb0-8c50-f7a7452e3160",
  project_id: projectId,
  deadline: data.deadline || null,
}),
        }
      );

      if (!res.ok) throw new Error("Failed to create epic");

      toast.success("Epic created successfully");

      router.push(`/projects/projects/${projectId}/epics`);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">


      {/* ================= FORM CONTAINER ================= */}
      <div className="flex-1 flex justify-center items-center px-4">

        <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm">

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 flex flex-col gap-5"
          >

            {/* ================= TITLE ================= */}
            <div>
              <label className="text-xs text-gray-500">Title</label>

              <input
                {...register("title")}
                className="w-full mt-1 bg-[#D7E2FF] rounded-md px-4 py-3 outline-none"
              />

              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* ================= DESCRIPTION ================= */}
            <div>
              <label className="text-xs text-gray-500">Description</label>

              <textarea
                {...register("description")}
                rows={4}
                className="w-full mt-1 bg-[#D7E2FF] rounded-md px-4 py-3 outline-none resize-none"
              />
            </div>

            {/* ================= ASSIGNEE ================= */}
            <div>
              <label className="text-xs text-gray-500">Assignee</label>

              <select
                {...register("assignee_id")}
                className="w-full mt-1 bg-[#D7E2FF] rounded-md px-4 py-3 outline-none"
              >

                {loadingMembers ? (
                  <option>Loading...</option>
                ) : (
                  members.map((m) => (
                    <option key={m.user_id} value={m.user_id}>
                      {m.metadata?.name || m.email}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* ================= DEADLINE ================= */}
            <div>
              <label className="text-xs text-gray-500">Deadline</label>

              <input
                type="date"
                {...register("deadline")}
                className="w-full mt-1 bg-[#D7E2FF] rounded-md px-4 py-3 outline-none"
              />
            </div>

            {/* ================= BUTTONS ================= */}
            <div className="flex justify-between mt-3">

              <button
                type="button"
                onClick={() =>
                  router.push(`/project/${projectId}/epics`)
                }
                className="text-gray-500"
              >
                Cancel
              </button>

              <button
                disabled={isSubmitting}
                className="bg-[#014CBF] text-white px-5 py-2 rounded-md hover:bg-blue-600"
              >
                {isSubmitting ? "Creating..." : "Create"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}