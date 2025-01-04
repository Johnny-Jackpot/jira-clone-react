import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createAdminClient } from "@/lib/appwrite";
import { getMember, getMembers } from "@/features/members/utils";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { MemberRole } from "@/features/members/types";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const members = await getMembers({ databases, workspaceId });
      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return { ...member, name: user.name, email: user.email };
        }),
      );

      return c.json({
        data: {
          ...members,
          documents: populatedMembers,
        },
      });
    },
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const user = c.get("user");
    const databases = c.get("databases");

    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId,
    );

    const allMembersInWorkspace = await getMembers({
      databases,
      workspaceId: memberToDelete.workspaceId,
    });

    if (allMembersInWorkspace.documents.length === 1) {
      return c.json({ error: "Cannot delete the last member" }, 400);
    }

    const currentMember = await getMember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    });

    if (!currentMember || currentMember.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    return c.json({ data: { $id: memberId } });
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
    async (c) => {
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");
      const user = c.get("user");
      const databases = c.get("databases");

      const memberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId,
      );

      const currentMember = await getMember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      });
      if (!currentMember || currentMember.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const allMembersInWorkspace = await getMembers({
        databases,
        workspaceId: memberToUpdate.workspaceId,
      });
      if (allMembersInWorkspace.documents.length === 1) {
        return c.json({ error: "Cannot downgrade the last member" }, 400);
      }

      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      });

      return c.json({ data: { $id: memberId } });
    },
  );

export default app;
