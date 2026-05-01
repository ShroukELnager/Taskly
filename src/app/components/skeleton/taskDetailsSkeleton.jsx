"use client";

export default function TaskDetailsSkeleton() {
  return (
    <div className="animate-pulse w-full h-full">

      <div className="grid grid-cols-1 md:grid-cols-3">

        <div className="col-span-2 p-6 space-y-6">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-6 w-2/3 bg-gray-200 rounded" />
          </div>

          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-5/6 bg-gray-200 rounded" />
            <div className="h-3 w-4/6 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="p-6 bg-[#F1F3FF] space-y-6">
          <div className="space-y-2">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-8 w-full bg-gray-200 rounded" />
          </div>

          <div className="space-y-3">
            <div className="h-3 w-20 bg-gray-200 rounded" />

            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="h-2 w-16 bg-gray-200 rounded" />
              </div>
            </div>
          </div>

          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-28 bg-gray-200 rounded" />
          <div className="h-4 w-36 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="md:hidden p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl" />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl" />
          ))}
        </div>

        <div className="h-24 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}