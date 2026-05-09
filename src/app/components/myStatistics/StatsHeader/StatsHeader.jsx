export default function StatsHeader() {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="w-full text-center lg:text-left">
        <h1 className="text-xl font-semibold">Weekly Planner</h1>
        <p className="hidden text-sm text-gray-500 lg:block">
          Manage your deadlines and track team velocity.
        </p>
      </div>
    </div>
  );
}