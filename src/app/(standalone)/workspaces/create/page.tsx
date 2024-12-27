import React from "react";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { redirectToLoginIfNoUser } from "@/features/auth/actions";

const WorkspaceCreatePage: React.FC = async () => {
  await redirectToLoginIfNoUser();

  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
};

export default WorkspaceCreatePage;
