import React from "react";
import { redirectToLoginIfNoUser } from "@/features/auth/queries";
import { WorkspaceClient } from "./client";

const Page: React.FC = async () => {
  await redirectToLoginIfNoUser();

  return <WorkspaceClient />;
};

export default Page;
