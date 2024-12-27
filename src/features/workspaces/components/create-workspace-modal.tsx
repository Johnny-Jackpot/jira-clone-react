"use client";

import React from "react";
import { ResponsiveModal } from "@/components/responsive-modal";
import { WorkspaceForm } from "@/features/workspaces/components/workspace-form";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";

export const CreateWorkspaceModal: React.FC = () => {
  const { isOpen, setIsOpen, close } = useCreateWorkspaceModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <WorkspaceForm onCancel={close} />
    </ResponsiveModal>
  );
};
