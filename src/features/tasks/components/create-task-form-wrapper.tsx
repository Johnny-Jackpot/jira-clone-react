import React from "react";
import { Loader } from "lucide-react";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { Project } from "@/features/projects/types";
import { Member } from "@/features/members/types";
import { Card, CardContent } from "@/components/ui/card";
import { TaskForm } from "@/features/tasks/components/task-form";

interface CreateTaskFormWrapperProps {
  onCancel: () => void;
}

export const CreateTaskFormWrapper: React.FC<CreateTaskFormWrapperProps> = ({
  onCancel,
}) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const projectOptions = projects?.documents.map((project: Project) => ({
    id: project.$id,
    name: project.name,
    imagePreview: project.imagePreview,
  }));

  const memberOptions = members?.documents.map((member: Member) => ({
    id: member.$id,
    name: member.name,
  }));

  const isLoading = isLoadingProjects || isLoadingMembers;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <TaskForm
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []}
      onCancel={onCancel}
    />
  );
};
