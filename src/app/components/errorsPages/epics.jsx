"use client";

import Image from "next/image";

export default function EpicsError({ fetchEpics }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">

      <Image
        src="/images/Background.svg"
        width={120}
        height={120}
        alt="error"
      />

      <h2 className="mt-6 text-lg font-semibold text-gray-800">
        Something went wrong
      </h2>

      <p className="mt-2 text-sm text-gray-500 max-w-md">
        We're having trouble loading your epics right now.
        Please try again in a moment.
      </p>

      <button
        onClick={fetchEpics}
        className="mt-6 bg-[#014CBF] text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Retry connection
      </button>
    </div>
  );
}