import React from "react";
import { WorkspaceForm } from "@/features/workspaces/components/workspace-form";
import { redirectToLoginIfNoUser } from "@/features/auth/actions";

const WorkspaceCreatePage: React.FC = async () => {
  await redirectToLoginIfNoUser();

  return (
    <div className="w-full lg:max-w-xl">
      <WorkspaceForm />
    </div>
  );
};

export default WorkspaceCreatePage;
