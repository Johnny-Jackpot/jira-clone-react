import React from "react";
import { redirectToLoginIfNoUser } from "@/features/auth/queries";
import { getProject } from "@/features/projects/queries";
import { ProjectForm } from "@/features/projects/components/project-form";
import DeleteProject from "@/features/projects/components/delete-project";
import { Project } from "@/features/projects/types";

const ProjectSettingsPage = async ({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) => {
  await redirectToLoginIfNoUser();
  const { projectId } = await params;
  const project = (await getProject(projectId)) as Project;

  return (
    <div className="w-full lg:max-w-xl flex flex-col gap-y-4">
      <ProjectForm initialValues={project} />
      <DeleteProject project={project} />
    </div>
  );
};

export default ProjectSettingsPage;
