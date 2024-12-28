"use client";

import React from "react";
import { Workspace } from "@/features/workspaces/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useResetInviteCode } from "@/features/workspaces/api/use-reset-invite-code";

type ResetInviteCodeProps = {
  workspace: Workspace;
};

const ResetInviteCode: React.FC<ResetInviteCodeProps> = ({ workspace }) => {
  const [ResetInviteCodeDialog, confirmResetInviteCode] = useConfirm(
    `Reset invite code for "${workspace.name}" workspace`,
    `Are you sure you want to reset invite code for "${workspace.name}" workspace? This action can not be undone.`,
    "destructive",
  );

  const { mutate, isPending } = useResetInviteCode();

  const handleResetInviteCode = async () => {
    const confirmed = await confirmResetInviteCode();
    if (!confirmed) {
      return;
    }

    mutate({
      param: { workspaceId: workspace.$id },
    });
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <ResetInviteCodeDialog />
      <CardContent className="p-7">
        <div className="flex flex-col">
          <h3 className="font-bold">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">
            Reset invite code for workspace is irreversible. New invite code will be generated.
          </p>
          <Button
            className="mt-6 w-fit ml-auto"
            size="sm"
            variant="destructive"
            type="button"
            onClick={handleResetInviteCode}
            disabled={isPending}
          >
            Reset invite code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResetInviteCode;
