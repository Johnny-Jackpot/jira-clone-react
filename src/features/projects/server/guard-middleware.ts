import { getProject } from "@/features/projects/queries";
import { createMiddleware } from "hono/factory";

export const projectMemberMiddleware = createMiddleware(async (c, next) => {
  const { projectId } = c.req.param();

  const project = await getProject(projectId);

  if (!project) {
    return c.json({ error: "Forbidden" }, 403);
  }

  c.set("project", project);

  await next();
});
