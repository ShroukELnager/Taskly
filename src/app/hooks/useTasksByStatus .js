import { useQuery } from "@tanstack/react-query";
import { getTasksByStatus } from "../services/tasks.service";

export function useTasksByStatus({ projectId, status, search }) {
  return useQuery({
    queryKey: ["tasks", projectId, status, search],
    queryFn: () =>
      getTasksByStatus({
        projectId,
        status,
        search,
      }),
    enabled: !!projectId && !!status,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}