import React from "react";
import { redirect } from "next/navigation";
import { WorkspaceForm } from "@/features/workspaces/components/workspace-form";
import { getWorkspace } from "@/features/workspaces/queries";
import { redirectToLoginIfNoUser } from "@/features/auth/queries";
import DeleteWorkspace from "@/features/workspaces/components/delete-workspace";
import ResetInviteCode from "@/features/workspaces/components/reset-invite-code";

const WorkspaceIdSettings = async ({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) => {
  await redirectToLoginIfNoUser();
  const { workspaceId } = await params;
  const urlToRedirect = `/workspaces/${workspaceId}`;

  const workspace = await getWorkspace(workspaceId);
  if (!workspace) {
    redirect(urlToRedirect);
  }

  return (
    <div className="w-full lg:max-w-xl flex flex-col gap-y-4">
      <WorkspaceForm initialValues={workspace} />
      <ResetInviteCode workspace={workspace} />
      <DeleteWorkspace workspace={workspace} />
    </div>
  );
};

export default WorkspaceIdSettings;
