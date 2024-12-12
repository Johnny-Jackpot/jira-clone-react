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
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/config";

const app = new Hono().post(
  "/",
  sessionMiddleware,
  zValidator("form", createWorkspaceSchema),
  async (c) => {
    const { name, image } = c.req.valid("form");

    const user = c.get("user");
    const databases: DatabasesType = c.get("databases");
    const storage: StorageType = c.get("storage");

    let storedImage: Models.File | undefined;
    let imagePreview: string | undefined;

    if (image instanceof File) {
      storedImage = await storage.createFile(
        IMAGES_BUCKET_ID,
        ID.unique(),
        image,
      );
      const arrayBuffer = await storage.getFilePreview(
        IMAGES_BUCKET_ID,
        storedImage.$id,
      );

      imagePreview = `data:image/png;base64${Buffer.from(arrayBuffer).toString("base64")}`;
    }

    const workspace = await databases.createDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
        imageId: storedImage?.$id,
        imagePreview,
      },
    );

    return c.json({ data: workspace });
  },
);

export default app;
