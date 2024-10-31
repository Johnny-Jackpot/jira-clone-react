import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const QUERY_KEY_CURRENT_USER = "current";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEY_CURRENT_USER],
    queryFn: async () => {
      const response = await client.api.auth.current.$get();
      if (!response.ok) {
        return null;
      }

      const { data } = await response.json();

      return data;
    },
  });
};
