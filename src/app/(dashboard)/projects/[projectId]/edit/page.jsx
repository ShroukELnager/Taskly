"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function EditProjectPage() {
  const router = useRouter();

  const { projectId } = useParams();

  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onSubmit",
  });

  const description = watch("description") || "";

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("access_token="))
          ?.split("=")[1];

        const res = await fetch(
          `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/projects?id=eq.${projectId}`,
          {
            method: "GET",
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await res.json();

        if (data?.[0]) {
          setValue("name", data[0].name);
          setValue("description", data[0].description);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, setValue]);

  const onSubmit = async (data) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

      const res = await fetch(
        `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/projects?id=eq.${projectId}`,
        {
          method: "PATCH",
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            description: data.description,
          }),
        },
      );

      if (!res.ok) {
        toast.error("Failed to update project");
        return;
      }

      toast.success("Project updated successfully");

      router.push("/projects");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading project...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ================= HEADER ================= */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="font-semibold text-3xl">Edit Project</h1>

        <button
          onClick={() => router.push("/projects")}
          className="text-gray-500 hover:text-black"
        >
          Cancel
        </button>
      </div>

      {/* ================= FORM CONTAINER ================= */}
      <div className="flex-1 flex justify-center items-center px-4">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm overflow-hidden">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 flex flex-col gap-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-[40px] h-[40px] bg-[#E5EEFA] rounded-lg flex items-center justify-center">
                <Image
                  src="/images/projIcon.svg"
                  alt="project"
                  width={20}
                  height={20}
                />
              </div>

              <div>
                <h1 className="font-semibold text-lg">Edit Project Details</h1>
                <p className="text-gray-600 text-sm">
                  Update your project information
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500">Project name</label>

              <input
                {...register("name", { required: "Name is required" })}
                className={`bg-[#D7E2FF] rounded-md px-4 py-3 outline-none ${
                  errors.name ? "border border-red-500" : ""
                }`}
              />

              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* ================= DESCRIPTION ================= */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500">Description</label>

              <textarea
                {...register("description")}
                rows={5}
                maxLength={500}
                className="bg-[#D7E2FF] rounded-md px-4 py-3 resize-none outline-none"
              />

              <p className="text-xs text-gray-500 text-right">
                {description.length}/500
              </p>
            </div>

            <div className="flex justify-between mt-3">
              <button
                type="button"
                onClick={() => router.push("/projects")}
                className="text-gray-500 hover:text-black"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#014CBF] text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
