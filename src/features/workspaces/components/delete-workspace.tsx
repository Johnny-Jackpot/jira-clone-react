"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Workspace } from "@/features/workspaces/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "@/features/workspaces/api/use-delete-workspace";

type DeleteWorkspaceProps = {
  workspace: Workspace;
};

const DeleteWorkspace: React.FC<DeleteWorkspaceProps> = ({ workspace }) => {
  const router = useRouter();

  const [DeleteDialog, confirmDelete] = useConfirm(
    `Delete "${workspace.name}" workspace`,
    `Are you sure you want to delete "${workspace.name}" workspace? This action can not be undone.`,
    "destructive",
  );

  const { mutate, isPending } = useDeleteWorkspace();

  const handleDelete = async () => {
    const confirmed = await confirmDelete();
    if (!confirmed) {
      return;
    }

    mutate(
      {
        param: { workspaceId: workspace.$id },
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
            Deleting workspace is irreversible and will remove all associated
            data
          </p>
          <Button
            className="mt-6 w-fit ml-auto"
            size="sm"
            variant="destructive"
            type="button"
            onClick={handleDelete}
            disabled={isPending}
          >
            Delete workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeleteWorkspace;
