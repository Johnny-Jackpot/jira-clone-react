import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const WORKSPACES_QUERY_KEY = "workspaces";

export const useGetWorkspaces = () => {
  return useQuery({
    queryKey: [WORKSPACES_QUERY_KEY],
    queryFn: async () => {
      const response = await client.api.workspaces.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
