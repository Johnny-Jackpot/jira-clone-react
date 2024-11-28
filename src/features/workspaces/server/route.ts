import { Hono } from "hono";
import { ID, type Databases as DatabasesType } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { createWorkspaceSchema } from "@/features/workspaces/schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, WORKSPACES_ID } from "@/config";

const app = new Hono().post(
  "/",
  sessionMiddleware,
  zValidator("json", createWorkspaceSchema),
  async (c) => {
    const { name } = c.req.valid("json");

    const user = c.get("user");
    const databases: DatabasesType = c.get("databases");

    const workspace = await databases.createDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
      },
    );

    return c.json({ data: workspace });
  },
);

export default app;
