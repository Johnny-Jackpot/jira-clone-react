import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

type UseGetTaskProps = {
  taskId?: string;
};

export const useGetTask = ({ taskId }: UseGetTaskProps) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const id = taskId as string;
      const response = await client.api.tasks[":taskId"].$get({
        param: { taskId: id },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }

      const { data } = await response.json();

      return data;
    },
    enabled: !!taskId,
  });
};
