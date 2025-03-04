import React from "react";
import { useRouter } from "next/navigation";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { cn } from "@/lib/utils";
import { TaskStatus } from "../../types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

interface EventCardProps {
  id: string;
  title: string;
  status: TaskStatus;
  project: Record<string, any> | undefined;
  assignee: Record<string, any> | undefined;
}

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "border-l-pink-500",
  [TaskStatus.TODO]: "border-l-red-500",
  [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
  [TaskStatus.IN_REVIEW]: "border-l-blue-500",
  [TaskStatus.DONE]: "border-l-emerald-500",
};

export const EventCard = ({
  id,
  title,
  status,
  project,
  assignee,
}: EventCardProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  return (
    <div className="px-2">
      <div
        onClick={onClick}
        className={cn(
          "px-1.5 py-1 text-xs bg-white text-primary border rounded-md border-l-4",
          "flex flex-col gap-1.5 cursor-pointer hover:opacity-75 transition",
          statusColorMap[status]
        )}
      >
        <p>{title}</p>
        <div className="flex items-center gap-x-1">
          <MemberAvatar name={assignee?.name} />
          <div className="size-1 rounded-full bg-neutral-300"></div>
          <ProjectAvatar
            name={project?.name}
            image={project?.imagePreview}
            fallbackClassName="text-[10px]"
          />
        </div>
      </div>
    </div>
  );
};
