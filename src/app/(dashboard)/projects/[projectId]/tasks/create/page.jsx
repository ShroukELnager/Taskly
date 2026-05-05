"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getEpics } from "@/app/services/epics.service";
import { getProjectMembers } from "@/app/services/members.service";
import { createTask } from "@/app/services/tasks.service";

export default function CreateTaskPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const statusFromUrl = searchParams.get("status");
  const epicIdFromUrl = searchParams.get("epicId");

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
    if (epicIdFromUrl) {
      setValue("epic_id", epicIdFromUrl);
    }
  }, [epicIdFromUrl, statusFromUrl, setValue]);

  const { data: epics = [], isLoading: loadingEpics } = useQuery({
    queryKey: ["epics-options", projectId],
    queryFn: () => getEpics({ projectId, page: 1, limit: 100 }),
    enabled: !!projectId,
    select: (res) => res?.data || [],
  });

  const { data: members = [], isLoading: loadingMembers } = useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => getProjectMembers(projectId),
    enabled: !!projectId,
    select: (res) => res?.data || [],
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      router.push(`/projects/${projectId}/tasks`);
    },
  });

  const onSubmit = (data) => {
    createTaskMutation.mutate({
      project_id: projectId,
      ...data,
      assignee_id: data.assignee_id || null,
      epic_id: data.epic_id || null,
      due_date: data.due_date || null,
    });
  };

  const submitError = createTaskMutation.error?.message;
  const isPending = isSubmitting || createTaskMutation.isPending;

  return (
    <div className="min-h-screen flex justify-center p-3 sm:p-6 bg-[#F9F9FF]">
      <div className="w-full max-w-3xl bg-white rounded-2xl p-4 sm:p-6 shadow-md">
        <h1 className="text-2xl font-semibold mb-1">Create New Task</h1>
        <p className="text-sm text-gray-500 mb-6">
          Initialize a new work item within the project ecosystem.
        </p>

        {submitError && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {submitError}
          </p>
        )}

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
                defaultValue=""
              >
                <option value="">
                  {loadingMembers ? "Loading members..." : "Select Team Member"}
                </option>
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
              defaultValue=""
            >
              <option value="">
                {loadingEpics ? "Loading epics..." : "Select Epic Link"}
              </option>
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
              type="button"
              onClick={() => router.push(`/projects/${projectId}/tasks`)}
              className="bg-white text-blue-700 px-6 py-3 rounded-md w-full sm:w-auto"
            >
              Back
            </button>

            <button
              disabled={isPending}
              className="bg-blue-700 text-white px-6 py-3 rounded-md w-full sm:w-auto disabled:opacity-60"
            >
              {isPending ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
