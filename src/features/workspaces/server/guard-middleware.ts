import { createMiddleware } from "hono/factory";
import type { Databases as DatabasesType } from "node-appwrite";
import { getMember } from "@/features/members/utils";
import { MemberRole } from "@/features/members/types";

export const userIsWorkspaceAdminMiddleware = createMiddleware(
  async (c, next) => {
    const user = c.get("user");
    const databases: DatabasesType = c.get("databases");
    const workspaceId = c.req.param("workspaceId");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Forbidden" }, 403);
    }

    await next();
  },
);
