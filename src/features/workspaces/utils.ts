import { type Databases as DatabasesType, Query } from "node-appwrite";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { Workspace } from "@/features/workspaces/types";

export const workspacesUtils = {
  async getWorkspaces(userId: string, databases: DatabasesType) {
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", userId),
    ]);

    if (members.total === 0) {
      return null;
    }

    const workspaceIds: string[] = members.documents.map(
      (member) => member.workspaceId,
    );

    return await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
      Query.orderDesc("$createdAt"),
      Query.contains("$id", workspaceIds),
    ]);
  },
  async getWorkspace(workspaceId: string, databases: DatabasesType) {
    return await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
    );
  },
};
