"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

type DatePickerProps = {
  value: Date | undefined;
  onChange: () => void;
  className?: string;
  placeholder?: string;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  className,
  placeholder = "Select date",
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className={cn(
            "w-full justify-start items-center text-left font-normal px-3",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 mb-0.5 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => onChange(date as Date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
