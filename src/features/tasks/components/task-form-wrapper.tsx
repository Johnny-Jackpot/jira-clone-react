import React from "react";
import { Loader } from "lucide-react";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { Card, CardContent } from "@/components/ui/card";
import { TaskForm } from "@/features/tasks/components/task-form";
import { useGetTask } from "../api/use-get-task";

interface TaskFormWrapperProps {
  onCancel: () => void;
  taskId?: string;
}

export const TaskFormWrapper: React.FC<TaskFormWrapperProps> = ({
  onCancel,
  taskId,
}) => {
  const workspaceId = useWorkspaceId();

  const { data: task, isLoading: isLoadingTask } = useGetTask({ taskId });

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const projectOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imagePreview: project.imagePreview,
  }));

  const memberOptions = members?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
  }));

  const isLoading = isLoadingProjects || isLoadingMembers || isLoadingTask;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (taskId && !task) {
    return null;
  }

  return (
    <TaskForm
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []}
      onCancel={onCancel}
      initialValues={task ?? undefined}
    />
  );
};
