import React from "react";

export default function EpicsSkeleton() {
  return (
    <div className="min-h-screen flex justify-center">
      
      <div className="w-full max-w-6xl p-4 animate-pulse">

        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-40 bg-gray-200 rounded-md" />

          <div className="flex items-center gap-3">
            <div className="h-10 w-52 bg-gray-200 rounded-md" />
            <div className="h-10 w-28 bg-gray-200 rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-gray-200 space-y-4"
            >
              <div className="h-5 w-20 bg-gray-200 rounded-md" />

              <div className="h-5 w-3/4 bg-gray-200 rounded-md" />

              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg" />

                <div className="space-y-2">
                  <div className="h-3 w-20 bg-gray-200 rounded-md" />
                  <div className="h-3 w-32 bg-gray-200 rounded-md" />
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <div className="h-3 w-24 bg-gray-200 rounded-md" />
                <div className="h-3 w-16 bg-gray-200 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <div className="h-10 w-64 bg-gray-200 rounded-md" />
        </div>

      </div>
    </div>
  );
}