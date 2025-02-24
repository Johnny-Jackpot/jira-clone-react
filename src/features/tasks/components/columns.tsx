"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { type Task } from "../types";
import { ColumnHeader } from "./column-header";
import { TaskDate } from "./task-date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { TaskActions } from "./task-actions";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <ColumnHeader column={column}>Task Name</ColumnHeader>
    ),
    cell: ({ row }) => {
      const name = row.original.name;

      return <p className="line-clamp-1">{name}</p>;
    },
  },
  {
    accessorKey: "project",
    header: ({ column }) => (
      <ColumnHeader column={column}>Project</ColumnHeader>
    ),
    cell: ({ row }) => {
      const project = row.original.project;

      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <ProjectAvatar
            className="size-6"
            name={project.name}
            image={project.image}
          />
          <p className="line-clamp-1">{project.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => (
      <ColumnHeader column={column}>Assignee</ColumnHeader>
    ),
    cell: ({ row }) => {
      const assignee = row.original.assignee;

      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <MemberAvatar
            className="size-6"
            fallbackClassName="text-xs"
            name={assignee.name}
          />
          <p className="line-clamp-1">{assignee.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <ColumnHeader column={column}>Due Date</ColumnHeader>
    ),
    cell: ({ row }) => <TaskDate value={row.original.dueDate} />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <ColumnHeader column={column}>Status</ColumnHeader>,
    cell: ({ row }) => {
      const status = row.original.status;

      return <Badge variant={status}>{snakeCaseToTitleCase(status)}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.$id;
      const projectId = row.original.projectId;

      return (
        <TaskActions id={id} projectId={projectId}>
          <Button variant="ghost" className="size-8 p-0">
            <MoreVertical className="size-4" />
          </Button>
        </TaskActions>
      );
    },
  },
];
