import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

type UseGetProjectsProps = {
  workspaceId: string;
};

export const useGetProjects = ({ workspaceId }: UseGetProjectsProps) => {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      debugger;
      const response = await client.api.projects.$get({
        query: { workspaceId },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
