import { createMiddleware } from "hono/factory";
import type { Databases as DatabasesType, Models } from "node-appwrite";
import { getMember } from "@/features/members/utils";
import { Member, MemberRole } from "@/features/members/types";

type AdditionalContext = {
  Variables: {
    member: Models.Document<Member>;
  };
};

export const userIsWorkspaceAdminMiddleware =
  createMiddleware<AdditionalContext>(async (c, next) => {
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

    c.set("member", member);

    await next();
  });
