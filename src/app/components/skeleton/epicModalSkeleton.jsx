"use client";

export default function EpicModalSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-6 w-1/2 bg-gray-200 rounded" />
      </div>

      <div className="space-y-2">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-16 w-full bg-gray-200 rounded" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="h-12 bg-gray-200 rounded" />
        <div className="h-12 bg-gray-200 rounded" />
        <div className="h-12 bg-gray-200 rounded" />
      </div>

      <div className="space-y-3">
        <div className="h-4 w-32 bg-gray-200 rounded" />

        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between p-3">
            <div className="flex gap-3 items-center">
              <div className="w-6 h-6 bg-gray-200 rounded-full" />
              <div className="space-y-2">
                <div className="h-3 w-40 bg-gray-200 rounded" />
                <div className="h-2 w-24 bg-gray-200 rounded" />
              </div>
            </div>

            <div className="h-3 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}