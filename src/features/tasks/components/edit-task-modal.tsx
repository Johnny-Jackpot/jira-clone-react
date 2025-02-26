"use client";

import React from "react";
import { ResponsiveModal } from "@/components/responsive-modal";
import { TaskFormWrapper } from "@/features/tasks/components/task-form-wrapper";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";

export const EditTaskModal: React.FC = () => {
  const { taskId, close } = useEditTaskModal();

  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && <TaskFormWrapper onCancel={close} taskId={taskId} />}
    </ResponsiveModal>
  );
};
