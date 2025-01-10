import { createMiddleware } from "hono/factory";
import type { Databases as DatabasesType, Models } from "node-appwrite";
import { getMember } from "@/features/members/utils";
import { Member, MemberRole } from "@/features/members/types";

type AdditionalContext = {
  Variables: {
    member: Models.Document<Member>;
  };
};

export class WorkspaceMemberMiddlewareBuilder {
  private getWorkspaceId: (c) => string;
  private memberRole?: MemberRole;

  setWorkspaceIdGetter(fn: (c) => string) {
    this.getWorkspaceId = fn;
    return this;
  }

  setMemberRole(role: MemberRole) {
    this.memberRole = role;
    return this;
  }

  buildMiddleware() {
    if (!this.getWorkspaceId) {
      throw new Error("Missing workspace id getter");
    }

    return createMiddleware<AdditionalContext>(async (c, next) => {
      const user = c.get("user");
      const databases: DatabasesType = c.get("databases");
      const workspaceId = this.getWorkspaceId(c);

      if (!workspaceId) {
        throw new Error("Could not find workspace id");
      }

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || (this.memberRole && member.role !== this.memberRole)) {
        return c.json({ error: "Forbidden" }, 403);
      }

      c.set("member", member);

      await next();
    });
  }
}

export const userIsWorkspaceAdminMiddleware =
  new WorkspaceMemberMiddlewareBuilder()
    .setWorkspaceIdGetter((c) => c.req.param("workspaceId"))
    .setMemberRole(MemberRole.ADMIN)
    .buildMiddleware();
