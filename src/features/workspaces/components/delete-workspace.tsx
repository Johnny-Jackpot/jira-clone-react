import React from "react";
import { Workspace } from "@/features/workspaces/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type DeleteWorkspaceProps = {
  workspace: Workspace;
};

const DeleteWorkspace: React.FC<DeleteWorkspaceProps> = ({ workspace }) => {
  return (
    <Card className="w-full h-full border-none shadow-none">
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
          >
            Delete workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeleteWorkspace;
