"use client";

import React from "react";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateTaskFormWrapper } from "@/features/tasks/components/create-task-form-wrapper";

export const CreateTaskModal: React.FC = () => {
  const { isOpen, setIsOpen, close } = useCreateTaskModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskFormWrapper onCancel={close} />
    </ResponsiveModal>
  );
};
