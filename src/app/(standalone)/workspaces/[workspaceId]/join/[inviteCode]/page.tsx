import React from "react";
import { redirectToLoginIfNoUser } from "@/features/auth/queries";
import { getWorkspaceInfo } from "@/features/workspaces/queries";

const WorkspaceIdJoinPage: React.FC = async ({ params }) => {
  await redirectToLoginIfNoUser();
  const { workspaceId } = await params;
  const { name } = await getWorkspaceInfo(workspaceId);

  return <div>WorkspaceIdJoinPage {name}</div>;
};

export default WorkspaceIdJoinPage;
