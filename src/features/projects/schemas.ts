import { z } from "zod";
import { imageRule } from "@/features/workspaces/schemas";

export const projectSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: imageRule,
  workspaceId: z.string(),
});
