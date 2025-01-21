"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { DottedSeparator } from "@/components/dotted-separator";
import { Project } from "@/features/projects/types";
import { useDeleteProject } from "@/features/projects/api/use-delete-workspace";

type DeleteProjectProps = {
  project: Project;
};

const DeleteProject: React.FC<DeleteProjectProps> = ({ project }) => {
  const router = useRouter();

  const [DeleteDialog, confirmDelete] = useConfirm(
    `Delete "${project.name}" project`,
    `Are you sure you want to delete "${project.name}" project? This action can not be undone.`,
    "destructive",
  );

  const { mutate, isPending } = useDeleteProject();

  const handleDelete = async () => {
    const confirmed = await confirmDelete();
    if (!confirmed) {
      return;
    }

    mutate(
      {
        param: { projectId: project.$id },
      },
      {
        onSuccess: () => {
          router.push("/");
        },
      },
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <DeleteDialog />
      <CardContent className="p-7">
        <div className="flex flex-col">
          <h3 className="font-bold">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">
            Deleting project is irreversible and will remove all associated data
          </p>
          <DottedSeparator className="py-7" />
          <Button
            className="mt-6 w-fit ml-auto"
            size="sm"
            variant="destructive"
            type="button"
            onClick={handleDelete}
            disabled={isPending}
          >
            Delete project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeleteProject;
