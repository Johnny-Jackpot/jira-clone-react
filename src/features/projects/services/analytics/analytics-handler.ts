import { TaskStatus } from "@/features/tasks/types";
import { type Databases, Query } from "node-appwrite";
import { AnalyticsData, ProjectAnalyticsService } from "./analyctics-service";
import { Member } from "@/features/members/types";

export const analycticsHandler = {
  async handle(databases: Databases, member: Member, commonFilters: string[]) {
    const filtersMap = {
      tasks: [],
      assignedTasks: [Query.equal("assigneeId", member.$id)],
      incompleteTasks: [Query.notEqual("status", TaskStatus.DONE)],
      completedTasks: [Query.equal("status", TaskStatus.DONE)],
      overdueTasks: [
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", new Date().toISOString()),
      ],
    };

    const projectAnalyticsService = new ProjectAnalyticsService(databases);
    return await projectAnalyticsService.getAnalytics<{
      [K in keyof typeof filtersMap]: AnalyticsData;
    }>({
      date: new Date(),
      numOfMonthsBeforeDate: 1,
      filtersMap,
      commonFilters,
    });
  },
};
