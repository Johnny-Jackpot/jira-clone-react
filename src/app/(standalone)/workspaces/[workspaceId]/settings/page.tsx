import { redirectToLoginIfNoUser } from "@/features/auth/actions";
import React from "react";

const WorkspaceIdSettings: React.FC<WorkspaceIdSettingsProps> = async ({
  params,
}) => {
  await redirectToLoginIfNoUser();
  const { workspaceId } = await params;

  return (
    <div>
      <h1>WorkspaceIdSettings {workspaceId}</h1>
    </div>
  );
};

export default WorkspaceIdSettings;
