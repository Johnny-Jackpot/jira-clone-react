"use client";

import React from "react";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { ResponsiveModal } from "@/components/responsive-modal";
import { TaskFormWrapper } from "@/features/tasks/components/task-form-wrapper";

export const CreateTaskModal: React.FC = () => {
  const { isOpen, setIsOpen, close } = useCreateTaskModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <TaskFormWrapper onCancel={close} />
    </ResponsiveModal>
  );
};
