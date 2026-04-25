"use client";
import React from "react";

export default function EpicsPagination({
  currentPage,
  totalCount,
  limit,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalCount / limit);
  const end = Math.min(currentPage * limit, totalCount);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-3 w-full">

      <p className="text-sm text-gray-500 hidden md:block text-left w-full">
        Showing {end} of {totalCount} epics
      </p>

      <div className="flex items-center gap-2 justify-center md:justify-end w-full">

        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-8 h-8 flex items-center justify-center border rounded-md disabled:opacity-50"
        >
          &lt;
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-md border ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-8 h-8 flex items-center justify-center border rounded-md disabled:opacity-50"
        >
          &gt;
        </button>

      </div>
    </div>
  );
}