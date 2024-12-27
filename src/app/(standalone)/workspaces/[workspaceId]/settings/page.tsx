import React from "react";
import { redirect } from "next/navigation";
import { WorkspaceForm } from "@/features/workspaces/components/workspace-form";
import { getWorkspace } from "@/features/workspaces/queries";
import { redirectToLoginIfNoUser } from "@/features/auth/queries";

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
    <div className="w-full lg:max-w-xl">
      <WorkspaceForm initialValues={workspace} />
    </div>
  );
};

export default WorkspaceIdSettings;
