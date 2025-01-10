"use client";

import React from "react";
import { ResponsiveModal } from "@/components/responsive-modal";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { ProjectForm } from "@/features/projects/components/project-form";

export const CreateProjectModal: React.FC = () => {
  const { isOpen, setIsOpen, close } = useCreateProjectModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <ProjectForm onCancel={close} />
    </ResponsiveModal>
  );
};
