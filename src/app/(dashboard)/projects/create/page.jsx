// "use client";

// import Image from "next/image";
// import React from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import { CreateProjSchema } from "@/app/components/schema/createProjSchema";
// import { createProject } from "@/app/services/projects.service";

// export default function Create() {
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     reset,
//     watch,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(CreateProjSchema),
//     mode: "onSubmit",
//   });

//   const description = watch("description") || "";

//   const onSubmit = async (data) => {
//     try {
//       await createProject({
//         name: data.name,
//         description: data.description || "",
//       });

//       toast.success("Project created successfully ");

//       reset();
//       router.push("/projects");
//     } catch (error) {
//       console.error(error);
//       toast.error(error.message);
//     }
//   };

//   return (
//     <div className="min-h-full flex flex-col bg-gray-50">
//       {/* HEADER */}
//       <div className="p-4 flex justify-between items-center">
//         <h1 className="font-semibold text-3xl">Add New Project</h1>

//         <button className="bg-[#014CBF] text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center gap-2">
//           <Image src="/images/invite.svg" alt="plus" width={16} height={16} />
//           <p className="text-sm font-medium">Invite Member</p>
//         </button>
//       </div>

//       <div className="flex-1 flex justify-center items-center px-4">
//         <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm overflow-hidden">
//           <form
//             className="p-6 flex flex-col gap-5"
//             onSubmit={handleSubmit(onSubmit)}
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-[40px] h-[40px] bg-[#E5EEFA] rounded-lg flex items-center justify-center">
//                 <Image
//                   src="/images/projIcon.svg"
//                   alt="project"
//                   width={20}
//                   height={20}
//                 />
//               </div>

//               <div>
//                 <h1 className="font-semibold text-lg">
//                   Initialize New Project
//                 </h1>
//                 <p className="text-gray-600 text-sm">
//                   Define the scope and foundational details of your project.
//                 </p>
//               </div>
//             </div>

//             {/* name */}
//             <div className="flex flex-col gap-2">
//               <label className="text-xs text-gray-500">Project name</label>

//               <input
//                 {...register("name")}
//                 className={`bg-[#D7E2FF] rounded-md px-4 py-3 outline-none ${
//                   errors.name ? "border border-red-500" : ""
//                 }`}
//               />

//               {errors.name && (
//                 <p className="text-red-500 text-sm flex items-center gap-1">
//                   <Image
//                     src="/images/error.svg"
//                     alt="error"
//                     width={14}
//                     height={14}
//                   />
//                   {errors.name.message}
//                 </p>
//               )}
//             </div>

//             {/* DESCRIPTION */}
//             <div className="flex flex-col gap-2">
//               <div className="flex justify-between items-center">
//                 <label className="text-xs text-gray-500">Description</label>

//                 <p className="text-xs text-gray-400">Optional</p>
//               </div>

//               <textarea
//                 {...register("description")}
//                 rows={5}
//                 maxLength={500}
//                 className={`bg-[#D7E2FF] rounded-md px-4 py-3 resize-none outline-none ${
//                   errors.description ? "border border-red-500" : ""
//                 }`}
//               />

//               <p className="text-xs text-gray-500 text-right">
//                 {description.length}/500 characters
//               </p>

//               {errors.description && (
//                 <p className="text-red-500 text-sm flex items-center gap-1">
//                   <Image
//                     src="/images/error.svg"
//                     alt="error"
//                     width={14}
//                     height={14}
//                     className="mr-2"
//                   />
//                   {errors.description.message}
//                 </p>
//               )}
//             </div>

//             {/* BUTTONS */}
//             <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-2">
//               <button
//                 type="button"
//                 onClick={() => {
//                   router.push("/projects");
//                 }}
//                 className="text-gray-500 hover:text-black"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="bg-[#014CBF] text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 disabled:opacity-50"
//               >
//                 {isSubmitting ? "Creating..." : "Create Project"}
//               </button>
//             </div>
//           </form>

//           {/* FOOTER */}
//           <div className="bg-[#F1F3FF] p-4 flex items-center gap-2">
//             <Image
//               src="/images/inspire.svg"
//               alt="info"
//               width={15}
//               height={15}
//             />

//             <p className="text-sm text-gray-600">
//               <strong>Pro Tip:</strong> Make sure to provide a clear and concise
//               project name and description.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreateProjSchema } from "@/app/components/schema/createProjSchema";
import { createProject } from "@/app/services/projects.service";

export default function Create() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateProjSchema),
    mode: "onSubmit",
  });

  const description = watch("description") || "";

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createProject,

    onSuccess: () => {
      toast.success("Project created successfully");

      queryClient.invalidateQueries({ queryKey: ["projects"] });

      reset();
      router.push("/projects");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data) => {
    await mutateAsync({
      name: data.name,
      description: data.description || "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-4 flex justify-between items-center">
        <h1 className="font-semibold text-3xl">Add New Project</h1>

        <button className="bg-[#014CBF] text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center gap-2">
          <Image src="/images/invite.svg" alt="plus" width={16} height={16} />
          <p className="text-sm font-medium">Invite Member</p>
        </button>
      </div>

      <div className="flex-1 flex justify-center items-center px-4">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm overflow-hidden">
          <form
            className="p-6 flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
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
                <h1 className="font-semibold text-lg">
                  Initialize New Project
                </h1>
                <p className="text-gray-600 text-sm">
                  Define the scope and foundational details of your project.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500">Project name</label>

              <input
                {...register("name")}
                className={`bg-[#D7E2FF] rounded-md px-4 py-3 outline-none ${
                  errors.name ? "border border-red-500" : ""
                }`}
              />

              {errors.name && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <Image
                    src="/images/error.svg"
                    alt="error"
                    width={14}
                    height={14}
                  />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs text-gray-500">Description</label>
                <p className="text-xs text-gray-400">Optional</p>
              </div>

              <textarea
                {...register("description")}
                rows={5}
                maxLength={500}
                className={`bg-[#D7E2FF] rounded-md px-4 py-3 resize-none outline-none ${
                  errors.description ? "border border-red-500" : ""
                }`}
              />

              <p className="text-xs text-gray-500 text-right">
                {description.length}/500 characters
              </p>

              {errors.description && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <Image
                    src="/images/error.svg"
                    alt="error"
                    width={14}
                    height={14}
                  />
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-2">
              <button
                type="button"
                onClick={() => router.push("/projects")}
                className="text-gray-500 hover:text-black"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="bg-[#014CBF] text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                {isPending ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>

          {/* FOOTER */}
          <div className="bg-[#F1F3FF] p-4 flex items-center gap-2">
            <Image
              src="/images/inspire.svg"
              alt="info"
              width={15}
              height={15}
            />

            <p className="text-sm text-gray-600">
              <strong>Pro Tip:</strong> Make sure to provide a clear and concise
              project name and description.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}