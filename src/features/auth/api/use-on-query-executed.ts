import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEY_CURRENT_USER } from "@/features/auth/api/use-current-user";
import { QUERY_KEY_WORKSPACES } from "@/features/workspaces/api/use-get-workspaces";

export const useOnQueryExecuted = ({
  successMsg,
  errorMsg,
}: {
  successMsg?: string;
  errorMsg?: string;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return {
    onSuccess: () => {
      if (successMsg) {
        toast.success(successMsg);
      }

      router.refresh();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_CURRENT_USER] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_WORKSPACES] });
    },
    onError: () => {
      if (errorMsg) {
        toast.error(errorMsg);
      }
    },
  };
};
