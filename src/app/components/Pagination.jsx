"use client";
import React from "react";

export default function Pagination({
  currentPage,
  totalCount,
  limit,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalCount / limit);

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalCount);

  return (
    <div className="flex items-center justify-between mt-6">
      {/* LEFT TEXT */}
      <p className="text-sm text-gray-500">
        Showing {end} of {totalCount} active projects
      </p>

      {/* RIGHT PAGINATION */}
      <div className="flex items-center gap-2">
        {/* PREV */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-8 h-8 flex items-center justify-center border rounded-md disabled:opacity-50"
        >
          &lt;
        </button>

        {/* PAGE NUMBERS */}
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

        {/* NEXT */}
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