import { Task, TaskStatus } from "../../types";

export type TasksState = {
  [key in TaskStatus]: Task[];
};

export type TaskUpdatesPayload = {
  $id: string;
  status: TaskStatus;
  position: number;
};

export type onKanbanChange = (tasks: TaskUpdatesPayload[]) => void;
