import React from "react";
import { type Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { type Task } from "../types";

interface ColumnHeaderProps {
  column: Column<Task>;
  children?: React.ReactNode;
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  column,
  children,
}) => {
  const sorted = column.getIsSorted();
  const arrows = {
    asc: ArrowUp,
    desc: ArrowDown,
  };
  const ArrowComponent = sorted ? arrows[sorted] : ArrowUpDown;

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {children}
      <ArrowComponent className="ml-2 h-4 w-4" />
    </Button>
  );
};
