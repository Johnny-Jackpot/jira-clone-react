import { Hono } from "hono";
import {
  ID,
  type Databases as DatabasesType,
  type Storage as StorageType,
  Models,
} from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { createWorkspaceSchema } from "@/features/workspaces/schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, WORKSPACES_ID } from "@/config";
import { WorkspaceService } from "@/features/workspaces/server/workspace-service";

const app = new Hono().post(
  "/",
  sessionMiddleware,
  zValidator("json", createWorkspaceSchema),
  async (c) => {
    const { name, image } = c.req.valid("json");

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

    let updatedWorkspace: Models.Document | undefined;

    if (image instanceof File) {
      const storage: StorageType = c.get("storage");
      const workspaceService = new WorkspaceService(storage, databases);
      updatedWorkspace = await workspaceService.uploadImage(image, workspace);
    }

    return c.json({ data: updatedWorkspace ? updatedWorkspace : workspace });
  },
);

export default app;
