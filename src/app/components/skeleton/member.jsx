export default function MembersSkeleton() {
  return (
    <div className="p-6 max-w-6xl mx-auto">

      <div className="flex justify-end mb-6">
        <div className="w-32 h-9 bg-gray-200 rounded-md animate-pulse" />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        <div className="grid grid-cols-3 p-4 border-b">
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
        </div>

        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="grid grid-cols-3 items-center p-4 border-b border-blue-100"
          >

            <div className="flex items-center gap-3 min-w-0">

              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse shrink-0" />

              <div className="flex flex-col gap-2 min-w-0">
                <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
                <div className="w-48 h-2 bg-gray-200 rounded animate-pulse" />
              </div>

            </div>

            <div>
              <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
            </div>

            <div>
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}