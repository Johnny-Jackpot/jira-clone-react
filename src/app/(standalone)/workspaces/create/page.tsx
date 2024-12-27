import React from "react";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";

const WorkspaceCreatePage: React.FC = () => {
  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
};

export default WorkspaceCreatePage;
