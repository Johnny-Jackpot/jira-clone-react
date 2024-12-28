import { Hono } from "hono";
import {
  ID,
  type Databases as DatabasesType,
  type Storage as StorageType,
  Models,
} from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { workspaceSchema } from "@/features/workspaces/schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  WORKSPACES_ID,
} from "@/config";
import { Member, MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";
import { workspacesUtils } from "@/features/workspaces/utils";
import { imagesUtils } from "@/features/storage/images/utils";
import { userIsWorkspaceAdminMiddleware } from "@/features/workspaces/server/guard-middleware";
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
    userIsWorkspaceAdminMiddleware,
    zValidator("form", workspaceSchema),
    async (c) => {
      const workspaceId = c.req.param("workspaceId");
      const { name, image } = c.req.valid("form");

      const databases: DatabasesType = c.get("databases");
      const storage: StorageType = c.get("storage");

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
  )
  .delete(
    ":workspaceId",
    sessionMiddleware,
    userIsWorkspaceAdminMiddleware,
    async (c) => {
      const workspaceId = c.req.param("workspaceId");

      const databases: DatabasesType = c.get("databases");
      const storage: StorageType = c.get("storage");

      const workspace = await workspacesUtils.getWorkspace(
        workspaceId,
        databases,
      );

      if (!workspace) {
        return c.json({ error: "Not Found" }, 404);
      }

      if (workspace.imageId) {
        await storage.deleteFile(IMAGES_BUCKET_ID, workspace.imageId);
      }

      await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

      const member: Models.Document<Member> = c.get("member");
      await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, member.$id);

      //TODO: delete projects and tasks

      return c.json({ data: { $id: workspaceId } });
    },
  )
  .post(
    ":workspaceId/reset-invite-code",
    sessionMiddleware,
    userIsWorkspaceAdminMiddleware,
    async (c) => {
      const workspaceId = c.req.param("workspaceId");

      const databases: DatabasesType = c.get("databases");

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          inviteCode: generateInviteCode(10),
        },
      );

      return c.json({ data: workspace });
    },
  )
  .post(
    ":workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ code: z.string() })),
    async (c) => {
      const { workspaceId } = c.req.param();
      const { code } = c.req.valid("json");

      const databases: DatabasesType = c.get("databases");
      const user = c.get("user");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (member) {
        return c.json({ error: "Already a member" }, 400);
      }

      const workspace = await workspacesUtils.getWorkspace(
        workspaceId,
        databases,
      );
      if (workspace.inviteCode !== code) {
        return c.json({ error: "Invalid invite code" }, 400);
      }

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        workspaceId,
        userId: user.$id,
        role: MemberRole.MEMBER,
      });

      return c.json({ data: workspace });
    },
  );

export default app;
