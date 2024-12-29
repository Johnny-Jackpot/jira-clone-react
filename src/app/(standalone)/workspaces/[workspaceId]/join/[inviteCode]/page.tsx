import React from "react";
import { redirect } from "next/navigation";
import { redirectToLoginIfNoUser } from "@/features/auth/queries";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";

const WorkspaceIdJoinPage: React.FC = async ({ params }) => {
  await redirectToLoginIfNoUser();
  const { workspaceId, inviteCode } = await params;
  const workspaceInfo = await getWorkspaceInfo(workspaceId);
  if (!workspaceInfo) {
    redirect("/");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm
        name={workspaceInfo.name}
        workspaceId={workspaceId}
        inviteCode={inviteCode}
      />
    </div>
  );
};

export default WorkspaceIdJoinPage;
