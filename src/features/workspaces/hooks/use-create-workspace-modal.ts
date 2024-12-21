import { useQueryState, parseAsBooleasn } from "nuqs";

export const useCreateWorkspaceModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-workspace",
    parseAsBooleasn.withDefault(false).withOptions({ clearOnDefault: true }),
  );

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    setIsOpen,
  };
};
