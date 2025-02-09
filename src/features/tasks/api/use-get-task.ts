import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

type UseGetTasksProps = {
  workspaceId: string;
};

export const useGetTask = ({ workspaceId }: UseGetTasksProps) => {
  return useQuery({
    queryKey: ["tasks", workspaceId],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: { workspaceId },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
