import { WorkspaceMemberMiddlewareBuilder } from "@/features/workspaces/server/guard-middleware";

export const userBelongsToWorkspaceMiddleware =
  new WorkspaceMemberMiddlewareBuilder()
    .setWorkspaceIdGetter((c) => c.req.valid("query").workspaceId)
    .buildMiddleware();
