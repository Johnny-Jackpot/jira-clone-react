import { z } from "zod";
import { TaskStatus } from "@/features/tasks/types";

export const taskSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  assigneeId: z.string().trim().min(1, "Required"),
  dueDate: z.coerce.date(),
  description: z.string().optional(),
});

export const getTasksSchema = z.object({
  workspaceId: z.string(),
  projectId: z.string().nullish(),
  assigneeId: z.string().nullish(),
  status: z.nativeEnum(TaskStatus).nullish(),
  dueDate: z.string().nullish(),
  search: z.string().nullish(),
});
