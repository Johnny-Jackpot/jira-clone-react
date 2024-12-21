"use client";

import React from "react";
import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";

export const CreateWorkspaceModal: React.FC = () => {
  return (
    <ResponsiveModal>
      <CreateWorkspaceForm />
    </ResponsiveModal>
  );
};
