import React from "react";
import { redirect } from "next/navigation";
import { WorkspaceForm } from "@/features/workspaces/components/workspace-form";
import { getWorkspace } from "@/features/workspaces/actions";
import { redirectToLoginIfNoUser } from "@/features/auth/actions";

const WorkspaceIdSettings: React.FC<WorkspaceIdSettingsProps> = async ({
  params,
}) => {
  await redirectToLoginIfNoUser();
  const { workspaceId } = await params;
  const urlToRedirect = `/workspaces/${workspaceId}`;

  const workspace = await getWorkspace(workspaceId);
  if (!workspace) {
    redirect(urlToRedirect);
  }

  return (
    <div>
      <WorkspaceForm initialValues={workspace} />
    </div>
  );
};

export default WorkspaceIdSettings;
