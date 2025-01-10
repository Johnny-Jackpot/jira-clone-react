import { Hono } from "hono";
import {
  Databases as DatabasesType,
  ID,
  Query,
  Storage as StorageType,
} from "node-appwrite";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import {
  canCreateProjectMiddleware,
  canGetProjectsMiddleware,
} from "@/features/projects/server/guard-middleware";
import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { projectSchema } from "@/features/projects/schema";
import { imagesUtils } from "@/features/storage/images/utils";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    canGetProjectsMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const { workspaceId } = c.req.valid("query");
      if (!workspaceId) {
        return c.json({ error: "Missing workspace id" }, 400);
      }

      const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ]);

      return c.json({ data: projects });
    },
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", projectSchema),
    canCreateProjectMiddleware,
    async (c) => {
      const { name, image, workspaceId } = c.req.valid("form");

      const databases: DatabasesType = c.get("databases");
      const storage: StorageType = c.get("storage");

      const { storedImage, imagePreview } = await imagesUtils.storeImage(
        storage,
        image,
      );

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          workspaceId,
          imageId: storedImage?.$id,
          imagePreview,
        },
      );

      return c.json({ data: project });
    },
  );

export default app;
