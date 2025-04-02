import { Query, Databases as DatabasesType } from "node-appwrite";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { DATABASE_ID, TASKS_ID } from "@/config";

export type AnalyticsData = {
  count: number;
  difference: number;
};

type Analytics = Record<string, AnalyticsData>;

export class ProjectAnalyticsService {
  constructor(protected databases: DatabasesType) {}

  async getAnalytics<T extends Analytics>({
    date,
    numOfMonthsBeforeDate,
    filtersMap,
    commonFilters = [],
  }: {
    date: Date;
    numOfMonthsBeforeDate: number;
    filtersMap: Record<string, string[]>;
    commonFilters?: string[];
  }): Promise<T> {
    const prevMonth = subMonths(date, numOfMonthsBeforeDate);

    const targetMonthStart = startOfMonth(date);
    const targetMonthEnd = endOfMonth(date);
    const prevMonthStart = startOfMonth(prevMonth);
    const prevMonthEnd = endOfMonth(prevMonth);

    const filtersKeys = Object.keys(filtersMap);

    const promises = filtersKeys.map((key) => {
      return this.fetchTargetAndPrevMonthTasks(
        targetMonthStart,
        targetMonthEnd,
        prevMonthStart,
        prevMonthEnd,
        filtersMap[key],
        commonFilters
      );
    });

    const allTasks = await Promise.all(promises);

    return allTasks
      .map(
        ([tasks, prevTasks]): AnalyticsData => ({
          count: tasks.total,
          difference: tasks.total - prevTasks.total,
        })
      )
      .reduce(
        (analytics, currentNumbers, index) => ({
          ...analytics,
          [filtersKeys[index]]: currentNumbers,
        }),
        {} as T
      );
  }

  protected fetchTargetAndPrevMonthTasks(
    targetMonthStart: Date,
    targetMonthEnd: Date,
    prevMonthStart: Date,
    prevMonthEnd: Date,
    filters: string[] = [],
    commonFilters: string[] = []
  ) {
    const commonQueries = [...filters, ...commonFilters];

    const targetMonthTasksPromise = this.fetchTasks([
      ...commonQueries,
      Query.greaterThanEqual("$createdAt", targetMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", targetMonthEnd.toISOString()),
    ]);

    const prevMonthTasksPromise = this.fetchTasks([
      ...commonQueries,
      Query.greaterThanEqual("$createdAt", prevMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", prevMonthEnd.toISOString()),
    ]);

    return Promise.all([targetMonthTasksPromise, prevMonthTasksPromise]);
  }

  protected fetchTasks(filters: string[]) {
    return this.databases.listDocuments(DATABASE_ID, TASKS_ID, filters);
  }
}
