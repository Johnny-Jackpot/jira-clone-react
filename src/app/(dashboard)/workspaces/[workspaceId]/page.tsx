import React from "react";
import { redirectToLoginIfNoUser } from "@/features/auth/queries";
import { WorkspaceAnalytics } from "@/features/workspaces/components/workspace-analytics";

const Page: React.FC = async () => {
  await redirectToLoginIfNoUser();

  return (
    <div>
      <WorkspaceAnalytics />
    </div>
  );
};

export default Page;
