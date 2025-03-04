import { useState, useEffect } from "react";
import { type Task, TaskStatus } from "../../types";
import { type TasksState } from "./types";

const getTasksState = (data: Task[]): TasksState => {
  const tasks: TasksState = {
    [TaskStatus.BACKLOG]: [],
    [TaskStatus.TODO]: [],
    [TaskStatus.IN_PROGRESS]: [],
    [TaskStatus.IN_REVIEW]: [],
    [TaskStatus.DONE]: [],
  };

  data.forEach((task) => {
    tasks[task.status].push(task);
  });

  Object.keys(tasks).forEach((status) => {
    tasks[status as TaskStatus].sort((a, b) => a.position - b.position);
  });

  return tasks;
};

export const useTasksState = (data: Task[]) => {
  const [tasks, setTasks] = useState<TasksState>(() => getTasksState(data));

  useEffect(() => {
    setTasks(getTasksState(data));
  }, [data]);

  return [tasks, setTasks] as const;
};
