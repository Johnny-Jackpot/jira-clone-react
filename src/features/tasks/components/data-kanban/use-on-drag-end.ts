import React, { useCallback } from "react";
import { type DropResult } from "@hello-pangea/dnd";
import { TaskStatus } from "../../types";
import { onKanbanChange, TasksState, TaskUpdatesPayload } from "./types";

export const useOnDragEnd = (
  setTasks: React.Dispatch<React.SetStateAction<TasksState>>,
  onChange: onKanbanChange
) => {
  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }

      const { source, destination } = result;
      const sourceStatus = source.droppableId as TaskStatus;
      const destStatus = destination.droppableId as TaskStatus;

      let updatesPayload: TaskUpdatesPayload[] = [];

      const getNewPosition = (index: number) =>
        Math.min((index + 1) * 1000, 1_000_000);

      setTasks((prevTasks: TasksState) => {
        const newTasks = { ...prevTasks };
        const sourceColumn = [...newTasks[sourceStatus]];
        const [movedTask] = sourceColumn.splice(source.index, 1);
        if (!movedTask) {
          return prevTasks;
        }

        const updatedMovedTask =
          sourceStatus !== destStatus
            ? { ...movedTask, status: destStatus }
            : movedTask;

        newTasks[sourceStatus] = sourceColumn;

        const destColumn = [...newTasks[destStatus]];
        destColumn.splice(destination.index, 0, updatedMovedTask);
        newTasks[destStatus] = destColumn;

        updatesPayload.push({
          $id: updatedMovedTask.$id,
          status: destStatus,
          position: getNewPosition(destination.index),
        });

        newTasks[destStatus].forEach((task, index) => {
          if (task && task.$id !== updatedMovedTask.$id) {
            const newPosition = getNewPosition(index);
            if (task.position !== newPosition) {
              updatesPayload.push({
                $id: task.$id,
                status: destStatus,
                position: newPosition,
              });
            }
          }
        });

        if (sourceStatus !== destStatus) {
          newTasks[sourceStatus].forEach((task, index) => {
            if (!task) {
              return;
            }

            const newPosition = getNewPosition(index);
            if (task.position !== newPosition) {
              updatesPayload.push({
                $id: task.$id,
                status: sourceStatus,
                position: newPosition,
              });
            }
          });
        }

        return newTasks;
      });

      onChange(updatesPayload);
    },
    [onChange]
  );

  return { onDragEnd };
};
