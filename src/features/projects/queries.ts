"use server";

import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { Project } from "@/features/projects/types";
import { createSessionClient } from "@/lib/appwrite";

export const getProject = async (projectId: string) => {
  try {
    const { account, databases } = await createSessionClient();
    const user = await account.get();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
    );

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });
    if (!member) {
      return null;
    }

    return project;
  } catch (e) {
    return null;
  }
};
