import React from "react";
import { redirectToLoginIfNoUser } from "@/features/auth/queries";
import { MembersList } from "@/features/workspaces/components/members-list";

const WorkspaceIdMembersPage: React.FC = async () => {
  await redirectToLoginIfNoUser();

  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  );
};

export default WorkspaceIdMembersPage;
