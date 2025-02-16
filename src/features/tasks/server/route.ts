import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { getTasksSchema, taskSchema } from "@/features/tasks/schemas";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { userBelongsToWorkspaceMiddleware } from "@/features/workspaces/server/guard-middleware";
import { Project } from "@/features/projects/types";
import { Member } from "@/features/members/types";
import { createAdminClient } from "@/lib/appwrite";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", getTasksSchema),
    userBelongsToWorkspaceMiddleware,
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const { workspaceId, projectId, assigneeId, status, dueDate, search } =
        c.req.valid("query");

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (projectId) query.push(Query.equal("projectId", projectId));
      if (assigneeId) query.push(Query.equal("assigneeId", assigneeId));
      if (status) query.push(Query.equal("status", status));
      if (dueDate) query.push(Query.equal("status", dueDate));
      if (search) query.push(Query.search("name", search));

      const tasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, query);
      const projectIds = tasks.documents.map((task) => task.projectId);
      const assigneeIds = tasks.documents.map((task) => task.assigneeId);

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : [],
      );
      const projectsMap = new Map<string, Project>();
      projects.documents.forEach((project) =>
        projectsMap.set(project.$id, project),
      );

      const members = await databases.listDocuments<Member>(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : [],
      );

      const getAssignee = async (member: Member) => {
        const user = await users.get(member.userId);

        return {
          ...member,
          name: user.name,
          email: user.email,
        };
      };
      const assignees = await Promise.all(members.documents.map(getAssignee));
      const assigneesMap: Map<
        string,
        Awaited<ReturnType<typeof getAssignee>>
      > = new Map();
      assignees.forEach((assignee) => assigneesMap.set(assignee.$id, assignee));

      const populatedTasks = tasks.documents.map((task) => ({
        ...task,
        project: projectsMap.get(task.projectId),
        assignee: assigneesMap.get(task.assigneeId),
      }));

      return c.json({
        data: {
          ...tasks,
          documents: populatedTasks,
        },
      });
    },
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", taskSchema),
    userBelongsToWorkspaceMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const { name, status, workspaceId, projectId, dueDate, assigneeId } =
        c.req.valid("json");

      const highestPositionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.orderAsc("position"),
          Query.limit(1),
        ],
      );

      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          status,
          workspaceId,
          projectId,
          dueDate,
          assigneeId,
          position: newPosition,
        },
      );

      return c.json({ data: task });
    },
  );

export default app;
