import { WorkspaceMemberMiddlewareBuilder } from "@/features/workspaces/server/guard-middleware";

export const canGetProjectsMiddleware = new WorkspaceMemberMiddlewareBuilder()
  .setWorkspaceIdGetter((c) => c.req.valid("query").workspaceId)
  .buildMiddleware();

export const canCreateProjectMiddleware = new WorkspaceMemberMiddlewareBuilder()
  .setWorkspaceIdGetter((c) => c.req.valid("form").workspaceId)
  .buildMiddleware();
