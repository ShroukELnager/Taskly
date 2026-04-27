"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";
export default function CreateTaskPage() {
  const { projectId } = useParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
   
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
  const Api_key = process.env.Api_key;
  const [epics, setEpics] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchEpics = async () => {
      const token = Cookies.get("access_token");

      const res = await fetch(
        `${Api_key}/rest/v1/project_epics?project_id=eq.${projectId}`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
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
        `${Api_key}/rest/v1/get_project_members?project_id=eq.${projectId}`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setMembers(data || []);
    };
    fetchMembers();
  }, [projectId]);

  const onSubmit = async (data) => {
    const token = Cookies.get("access_token");

    const res = await fetch(
      `${Api_key}/rest/v1/tasks`,
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
          status: data.status ,
        }),
      }
    );

    if (res.ok) {
      router.push(`/project/${projectId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl p-6 shadow-sm">

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
              className="w-full mt-1 p-3 bg-blue-50 rounded-md outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-xs font-semibold">STATUS *</label>
              <select
                {...register("status")}
                className="w-full mt-1 p-3 bg-blue-50 rounded-md"
              >
                <option value="TO_DO">TO DO</option>
           
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold">ASSIGNEE</label>
              <select
                {...register("assignee_id")}
                className="w-full mt-1 p-3 bg-blue-50 rounded-md"
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
              className="w-full mt-1 p-3 bg-blue-50 rounded-md"
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
              className="w-full mt-1 p-3 bg-blue-50 rounded-md"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">DESCRIPTION</label>
            <textarea
              {...register("description")}
              rows={5}
              placeholder="Provide detailed context for this task..."
              className="w-full mt-1 p-3 bg-blue-50 rounded-md"
            />
          </div>

          <div className="flex justify-end">
            <button
              disabled={isSubmitting}
              className="bg-blue-700 text-white px-6 py-3 rounded-md"
            >
              Create Task
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}