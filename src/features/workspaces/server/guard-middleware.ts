import { createMiddleware } from "hono/factory";
import type { Databases as DatabasesType, Models } from "node-appwrite";
import { getMember } from "@/features/members/utils";
import { Member, MemberRole } from "@/features/members/types";

type AdditionalContext = {
  Variables: {
    member: Models.Document<Member>;
  };
};

function createWorkspaceMemberMiddleware(role?: MemberRole) {
  return createMiddleware<AdditionalContext>(async (c, next) => {
    const user = c.get("user");
    const databases: DatabasesType = c.get("databases");
    const workspaceId =
      c.req.param("workspaceId") ||
      c.req.valid("query")?.workspaceId ||
      c.req.valid("form")?.workspaceId ||
      c.req.valid("json")?.workspaceId;

    if (!workspaceId) {
      throw new Error("Could not find workspace id");
    }

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || (role && member.role !== role)) {
      return c.json({ error: "Forbidden" }, 403);
    }

    c.set("member", member);

    await next();
  });
}

export const userIsWorkspaceAdminMiddleware = createWorkspaceMemberMiddleware(MemberRole.ADMIN);
export const userBelongsToWorkspaceMiddleware = createWorkspaceMemberMiddleware();
