import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { CalendarNavigateAction } from "./types";
import { format } from "date-fns";

interface ToolbarProps {
  date: Date;
  navigate: (action: CalendarNavigateAction) => void;
}

export const Toolbar = ({ date, navigate }: ToolbarProps) => {
  return (
    <div className="flex gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start">
      <Button onClick={() => navigate("PREV")} variant="secondary" size="icon">
        <ChevronLeftIcon className="size-4" />
      </Button>
      <div className="flex items-center border border-input rounded-md px-3 py-2 h-8 justify-center w-full lg:w-auto">
        <CalendarIcon className="size-4 mr-2" />
        <p className="text-sm">{format(date, "MMMM yyyy")}</p>
      </div>
      <Button onClick={() => navigate("NEXT")} variant="secondary" size="icon">
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
};
