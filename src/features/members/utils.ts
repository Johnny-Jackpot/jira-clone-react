import { Query, type Databases } from "node-appwrite";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Member } from "./types";

type GetMembersProps = {
  databases: Databases;
  workspaceId: string;
  userId?: string;
};

export const getMembers = async ({
  databases,
  workspaceId,
  userId,
}: GetMembersProps) => {
  const queries = [Query.equal("workspaceId", workspaceId)];
  if (userId) {
    queries.push(Query.equal("userId", userId));
  }

  return await databases.listDocuments<Member>(
    DATABASE_ID,
    MEMBERS_ID,
    queries
  );
};

export const getMember = async ({
  databases,
  workspaceId,
  userId,
}: Required<GetMembersProps>) => {
  const members = await getMembers({ databases, workspaceId, userId });
  return members.documents[0];
};
