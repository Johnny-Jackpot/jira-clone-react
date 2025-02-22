"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { type Task } from "../types";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
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
          Task Name
          <ArrowComponent className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];
