import { Hono } from "hono";
import { Query } from "node-appwrite";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import { userBelongsToWorkspaceMiddleware } from "@/features/projects/server/guard-middleware";
import { DATABASE_ID, PROJECTS_ID } from "@/config";

const app = new Hono().get(
  "/",
  sessionMiddleware,
  zValidator("query", z.object({ workspaceId: z.string() })),
  userBelongsToWorkspaceMiddleware,
  async (c) => {
    const databases = c.get("databases");
    const { workspaceId } = c.req.valid("query");

    const projects = databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.orderDesc("$createdAt"),
    ]);

    return c.json({ data: projects });
  },
);

export default app;
