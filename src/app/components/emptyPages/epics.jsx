"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function EmptyEpics({ projectId }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4 sm:px-6 text-center w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <Image
          src="/images/Abstract _Epic.png"
          alt="No epics"
          width={150}
          height={150}
          className="mx-auto w-28 sm:w-36 md:w-40 h-auto"
        />
      </div>

      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
        No epics in this project yet.
      </h2>

      <p className="text-sm sm:text-base text-gray-500 max-w-md mb-6 px-2">
        Break down your large project into manageable epics to track progress
        better and maintain architectural clarity.
      </p>

      <button
        onClick={() => {
          router.push(`/projects/${projectId}/epics/create`);
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
        Create First Epic
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-10 sm:mt-12 w-full max-w-4xl">
        <FeatureCard
          icon={
            <Image
              src="/images/high.png"
              width={20}
              height={20}
              alt="High-Level Goals"
              className="w-5 h-5"
            />
          }
          title="High-Level Goals"
          desc="Define the broad objectives that span across multiple cycles."
        />

        <FeatureCard
          icon={
            <Image
              src="/images/hierarchy.png"
              width={20}
              height={20}
              alt="Hierarchy Design"
              className="w-5 h-5"
            />
          }
          title="Hierarchy Design"
          desc="Link individual tasks to parent epics for a consolidated view."
        />

        <FeatureCard
          icon={
            <Image
              src="/images/track.png"
              width={20}
              height={20}
              alt="Track Velocity"
              className="w-5 h-5"
            />
          }
          title="Track Velocity"
          desc="Visualize percentage completion at a macro project level."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left hover:shadow-sm transition">
      <div className="mb-2">{icon}</div>

      <h4 className="font-medium text-gray-800 text-sm sm:text-base">
        {title}
      </h4>

      <p className="text-xs sm:text-sm text-gray-500 mt-1">{desc}</p>
    </div>
  );
}
