"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function EmptyProjects() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4 sm:px-6 text-center w-full max-w-6xl mx-auto">

      {/* Image */}
      <div className="mb-6">
        <Image
          src="/images/Abstract _Kinetic Blueprint_ Visual Element.png"
          alt="No projects"
          width={150}
          height={150}
          className="mx-auto w-28 sm:w-36 md:w-40 h-auto"
        />
      </div>

      {/* Title */}
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
        No  project yet.
      </h2>

      {/* Description */}
      <p className="text-sm sm:text-base text-gray-500 max-w-md mb-6 px-2">
You don’t have any projects yet. Start by defining
your first architectural workspace to begin tracking
tasks and epics.      </p>

      {/* Button */}
      <button
        onClick={() => {
          router.push(`/dashboard/projects/create`);
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-sm rounded-md shadow-md transition flex items-center gap-2 whitespace-nowrap"
      >
        <Image
          src="/images/btnIcon.png"
          width={18}
          height={18}
          alt="Create Epic"
          className="w-4 h-4"
        />
        Create First project
      </button>

      {/* Features */}
     
    </div>
  );
}
