"use client";

import { useWorkspaceId } from "../hooks/use-workspace-id";
import { useGetWorkspaceAnalytics } from "../api/use-get-workspace-analytics";
import { Analytics } from "@/features/projects/components/analytics";

export const WorkspaceAnalytics = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspaceAnalytics({ workspaceId });

  return <Analytics data={data} isLoading={isLoading} />;
};
