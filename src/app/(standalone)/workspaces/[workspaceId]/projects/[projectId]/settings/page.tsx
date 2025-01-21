import React from "react";
import { redirectToLoginIfNoUser } from "@/features/auth/queries";
import { getProject } from "@/features/projects/queries";
import { ProjectForm } from "@/features/projects/components/project-form";

const ProjectSettingsPage: React.FC = async ({ params }) => {
  await redirectToLoginIfNoUser();
  const { projectId } = await params;
  const project = await getProject(projectId);

  return (
    <div className="w-full lg:max-w-xl">
      <ProjectForm initialValues={project} />
    </div>
  );
};

export default ProjectSettingsPage;
