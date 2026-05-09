export default function ProjectsTasksCard({ projects }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-5 text-lg font-semibold text-slate-800">
        All Projects
      </h2>

      <div className="space-y-4">
        {projects?.length > 0 ? (
          projects.map((project) => (
            <div
              key={project.project_id}
              className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-gray-100 px-4 py-3 transition hover:bg-gray-50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-700">
                  {project.project_name}
                </p>
              </div>

              <div className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                {project.tasks_count} Tasks
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center py-10 text-sm text-gray-400">
            No Projects Found
          </div>
        )}
      </div>
    </div>
  );
}
