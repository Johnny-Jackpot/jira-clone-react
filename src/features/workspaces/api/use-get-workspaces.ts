import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const QUERY_KEY_WORKSPACES = "workspaces";

export const useGetWorkspaces = () => {
  return useQuery({
    queryKey: [QUERY_KEY_WORKSPACES],
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
