import { Hono } from "hono";
import {
  ID,
  type Databases as DatabasesType,
  type Storage as StorageType,
} from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { workspaceSchema } from "@/features/workspaces/schemas";
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
import { imagesUtils } from "@/features/storage/images/utils";

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
    zValidator("form", workspaceSchema),
    async (c) => {
      const { name, image } = c.req.valid("form");

      const user = c.get("user");
      const databases: DatabasesType = c.get("databases");
      const storage: StorageType = c.get("storage");

      const { storedImage, imagePreview } = await imagesUtils.storeImage(
        storage,
        image,
      );

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
    zValidator("form", workspaceSchema),
    async (c) => {
      const workspaceId = c.req.param("workspaceId");
      const { name, image } = c.req.valid("form");

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

      const workspace = await workspacesUtils.getWorkspace(
        workspaceId,
        databases,
      );
      const oldImageId = workspace?.imageId;

      const { storedImage, imagePreview } = await imagesUtils.storeImage(
        storage,
        image,
      );

      const updatedWorkspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
          imageId: image ? storedImage?.$id : null,
          imagePreview: image ? imagePreview : null,
        },
      );

      if ((storedImage || !image) && oldImageId) {
        await storage.deleteFile(IMAGES_BUCKET_ID, oldImageId);
      }

      return c.json({ data: updatedWorkspace });
    },
  );

export default app;
