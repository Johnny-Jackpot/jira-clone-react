import React from "react";
import { redirectToLoginIfNoUser } from "@/features/auth/queries";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";

const WorkspaceIdJoinPage: React.FC = async ({ params }) => {
  await redirectToLoginIfNoUser();
  const { workspaceId } = await params;
  const { name } = await getWorkspaceInfo(workspaceId);

  return <JoinWorkspaceForm name={name} />;
};

export default WorkspaceIdJoinPage;
