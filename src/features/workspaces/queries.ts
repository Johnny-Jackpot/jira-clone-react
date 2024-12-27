"use server";

import { cookies } from "next/headers";
import { getAppWriteClient } from "@/lib/appwrite";
import { AUTH_COOKIE } from "@/features/auth/constants";
import { Account, Databases } from "node-appwrite";
import { workspacesUtils } from "@/features/workspaces/utils";
import { getMember } from "@/features/members/utils";
import { MemberRole } from "@/features/members/types";

export const getWorkspaces = async () => {
  try {
    const requestCookies = await cookies();
    const sessionId = requestCookies.get(AUTH_COOKIE);
    if (!sessionId) {
      return null;
    }

    const client = getAppWriteClient().setSession(sessionId.value);
    const databases = new Databases(client);
    const account = new Account(client);
    const user = await account.get();

    return await workspacesUtils.getWorkspaces(user.$id, databases);
  } catch (e) {
    return null;
  }
};

export const getWorkspace = async (workspaceId: string) => {
  try {
    const requestCookies = await cookies();
    const sessionId = requestCookies.get(AUTH_COOKIE);
    if (!sessionId) {
      return null;
    }

    const client = getAppWriteClient().setSession(sessionId.value);
    const databases = new Databases(client);
    const account = new Account(client);
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
  } catch (e) {
    return null;
  }
};
