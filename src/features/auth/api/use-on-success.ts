import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY_CURRENT_USER } from "@/features/auth/api/use-current-user";

export const useOnSuccess = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    router.refresh();
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY_CURRENT_USER] });
  };
};
