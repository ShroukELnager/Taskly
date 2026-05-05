import { useQuery } from "@tanstack/react-query";
import { getTaskDetails } from "@/services/tasks";

export function useTaskDetails({ projectId, taskId }) {
  return useQuery({
    queryKey: ["taskDetails", projectId, taskId],
    queryFn: () => getTaskDetails({ projectId, taskId }),
    enabled: !!projectId && !!taskId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}