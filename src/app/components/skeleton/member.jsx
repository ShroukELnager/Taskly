export default function MembersSkeleton() {
  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* HEADER BUTTON SKELETON */}
      <div className="flex justify-end mb-6">
        <div className="w-32 h-9 bg-gray-200 rounded-md animate-pulse" />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {/* HEADER ROW */}
        <div className="grid grid-cols-3 p-4 border-b">
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* ROWS */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="grid grid-cols-3 items-center p-4 border-b border-blue-100"
          >

            {/* MEMBER */}
            <div className="flex items-center gap-3 min-w-0">

              {/* AVATAR */}
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse shrink-0" />

              {/* TEXT */}
              <div className="flex flex-col gap-2 min-w-0">
                <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
                <div className="w-48 h-2 bg-gray-200 rounded animate-pulse" />
              </div>

            </div>

            {/* ROLE */}
            <div>
              <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
            </div>

            {/* ACTION */}
            <div>
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}