import { useMutation } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { useOnQueryExecuted } from "@/features/auth/api/use-on-query-executed";

type ResponseType = InferResponseType<(typeof client.api.auth.logout)["$post"]>;

export const useLogout = () => {
  const { onSuccess, onError } = useOnQueryExecuted({
    successMsg: "Logged out",
    errorMsg: "Failed to log out",
  });

  return useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout["$post"]();
      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      return await response.json();
    },
    onSuccess,
    onError,
  });
};
