// hooks/useTasks.js
import { useQuery } from "@tanstack/react-query";
import { getProjectTasks } from "@/app/services/tasks.service";

export function useTasks({ projectId, search }) {
  return useQuery({
    queryKey: ["tasks", projectId, search],
    queryFn: () => getProjectTasks({ projectId, search }),
    select: (res) => res.data || [],
  });
}