import { Hono } from "hono";
import {
  ID,
  type Databases as DatabasesType,
  type Storage as StorageType,
  Models,
} from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "@/features/workspaces/schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  WORKSPACES_ID,
} from "@/config";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";
import { workspacesUtils } from "@/features/workspaces/utils";
import { getMember } from "@/features/members/utils";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases: DatabasesType = c.get("databases");
    const workspaces = await workspacesUtils.getWorkspaces(user.$id, databases);
    if (!workspaces) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    return c.json({ data: workspaces });
  })
  .post(
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

        imagePreview = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
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
          inviteCode: generateInviteCode(10),
        },
      );

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      });

      return c.json({ data: workspace });
    },
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      const { workspaceId } = c.req.params;
      const { name, image } = c.req.body;

      const user = c.get("user");
      const databases: DatabasesType = c.get("databases");
      const storage: StorageType = c.get("storage");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.status(403).json({ error: "Forbidden" });
      }
    },
  );

export default app;
