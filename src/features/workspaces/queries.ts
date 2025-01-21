"use server";

import { createSessionClient } from "@/lib/appwrite";
import { workspacesUtils } from "@/features/workspaces/utils";
import { getMember } from "@/features/members/utils";
import { MemberRole } from "@/features/members/types";

export const getWorkspaces = async () => {
  const { account, databases } = await createSessionClient();
  const user = await account.get();

  return await workspacesUtils.getWorkspaces(user.$id, databases);
};

export const getWorkspace = async (workspaceId: string) => {
  const { account, databases } = await createSessionClient();
  const user = await account.get();

  const member = await getMember({
    databases,
    workspaceId,
    userId: user.$id,
  });
  if (!member || member.role !== MemberRole.ADMIN) {
    return null;
  }

  return await workspacesUtils.getWorkspace(workspaceId, databases);
};

export const getWorkspaceInfo = async (workspaceId: string) => {
  const { databases } = await createSessionClient();

  const workspace = await workspacesUtils.getWorkspace(workspaceId, databases);

  return { name: workspace.name };
};
