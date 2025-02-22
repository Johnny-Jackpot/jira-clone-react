import React from "react";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetMembers } from "@/features/members/api/use-get-members";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

export const DataFilters: React.FC<DataFiltersProps> = () => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });
  const isLoading = isLoadingProjects || isLoadingMembers;
  const projectOptions = projects?.documents.map((project) => ({
    label: project.name,
    value: project.$id,
  }));
  const membersOptions = members?.documents.map((member) => ({
    label: member.name,
    value: member.$id,
  }));

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      Data filters goes here
    </div>
  );
};
