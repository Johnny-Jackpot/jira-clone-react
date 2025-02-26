import { useQueryState, parseAsString } from "nuqs";

export const useEditTaskModal = () => {
  const [taskId, setTaskId] = useQueryState("edit-task", parseAsString);

  return {
    taskId,
    open: (id: string) => setTaskId(id),
    close: () => setTaskId(null),
    setTaskId,
  };
};
