"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useParams, useRouter, useSearchParams } from "next/navigation";
export default function CreateTaskPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFromUrl = searchParams.get("status");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      status: "TO_DO",
      assignee_id: "",
      epic_id: "",
      due_date: "",
      description: "",
    },
  });
  useEffect(() => {
    if (statusFromUrl) {
      setValue("status", statusFromUrl);
    }
  }, [statusFromUrl, setValue]);

  // const Api_key = process.env.Api_key;
  const [epics, setEpics] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchEpics = async () => {
      const token = Cookies.get("access_token");

      const res = await fetch(
        `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/project_epics?project_id=eq.${projectId}`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      setEpics(data || []);
    };

    fetchEpics();
  }, [projectId]);

  useEffect(() => {
    const fetchMembers = async () => {
      const token = Cookies.get("access_token");

      const res = await fetch(
        `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/get_project_members?project_id=eq.${projectId}`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      setMembers(data || []);
    };

    fetchMembers();
  }, [projectId]);

  const onSubmit = async (data) => {
    const token = Cookies.get("access_token");

    const res = await fetch(
      `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/tasks`,
      {
        method: "POST",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: projectId,
          ...data,
          status: data.status,
        }),
      },
    );

    if (res.ok) {
      router.push(`/projects`);
    }
  };

  return (
    <div className="min-h-screen flex justify-center p-3 sm:p-6 bg-[#F9F9FF]">
      <div className="w-full max-w-3xl bg-white rounded-2xl p-4 sm:p-6 shadow-md">
        <h1 className="text-2xl font-semibold mb-1">Create New Task</h1>
        <p className="text-sm text-gray-500 mb-6">
          Initialize a new work item within the project ecosystem.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-xs font-semibold">TITLE *</label>
            <input
              {...register("title", { required: true })}
              placeholder="e.g., Finalize structural schematics"
              className="w-full mt-1 p-3 bg-[#EEF4FF] rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold">STATUS *</label>
              <select
                {...register("status")}
                className="w-full mt-1 p-3 bg-[#EEF4FF] rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="TO_DO">TO DO</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="BLOCKED">BLOCKED</option>
                <option value="IN_REVIEW">IN REVIEW</option>
                <option value="READY_FOR_QA">READY FOR QA</option>
                <option value="REOPENED">REOPENED</option>
                <option value="READY_FOR_PRODUCTION">
                  READY FOR PRODUCTION
                </option>
                <option value="DONE">DONE</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold">ASSIGNEE</label>
              <select
                {...register("assignee_id")}
                className="w-full mt-1 p-3 bg-[#EEF4FF] rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Team Member</option>
                {members.map((m) => (
                  <option key={m.user_id} value={m.user_id}>
                    {m.metadata?.name || m.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold">EPIC</label>
            <select
              {...register("epic_id")}
              className="w-full mt-1 p-3 bg-[#EEF4FF] rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Epic Link</option>
              {epics.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.epic_id} {e.title?.slice(0, 100)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold">DUE DATE</label>
            <input
              type="date"
              {...register("due_date")}
              className="w-full mt-1 p-3 bg-[#EEF4FF] rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">DESCRIPTION</label>
            <textarea
              {...register("description")}
              rows={5}
              placeholder="Provide detailed context for this task..."
              className="w-full mt-1 p-3 bg-[#EEF4FF] rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              onClick={() => router.push(`/projects/${projectId}/ta`)}
              className="bg-white text-blue-700 px-6 py-3 rounded-md w-full sm:w-auto"
            >
              Back
            </button>

            <button
              disabled={isSubmitting}
              className="bg-blue-700 text-white px-6 py-3 rounded-md w-full sm:w-auto"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
