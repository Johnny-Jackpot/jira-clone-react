import React from "react";
import { redirectToLoginIfNoUser } from "@/features/auth/queries";
import { getProject } from "@/features/projects/queries";

const Page: React.FC = async ({ params }) => {
  await redirectToLoginIfNoUser();
  const { projectId } = await params;
  const project = await getProject(projectId);

  return <div>Project Id: {projectId} {JSON.stringify(project)}</div>;
};

export default Page;
