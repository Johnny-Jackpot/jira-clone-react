"use client";

import { PageLoader } from "@/components/page-loader";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DottedSeparator } from "@/components/dotted-separator";
import { AnalyticsData } from "../../services/analytics/analyctics-service";
import { AnalyticsCard } from "./analytics-card";

interface AnalyticsProps {
  data?: {
    analytics: {
      tasks: AnalyticsData;
      assignedTasks: AnalyticsData;
      incompleteTasks: AnalyticsData;
      completedTasks: AnalyticsData;
      overdueTasks: AnalyticsData;
    };
  };
  isLoading?: boolean;
}

export const Analytics = ({ data, isLoading = false }: AnalyticsProps) => {
  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return null;
  }

  const {
    analytics: {
      tasks,
      assignedTasks,
      incompleteTasks,
      completedTasks,
      overdueTasks,
    },
  } = data;

  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Total tasks"
            value={tasks.count}
            difference={tasks.difference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Assigned tasks"
            value={assignedTasks.count}
            difference={assignedTasks.difference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Incomplete tasks"
            value={incompleteTasks.count}
            difference={incompleteTasks.difference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Completed tasks"
            value={completedTasks.count}
            difference={completedTasks.difference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Overdue tasks"
            value={overdueTasks.count}
            difference={overdueTasks.difference}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
