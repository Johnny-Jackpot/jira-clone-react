"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Workspace } from "@/features/workspaces/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useResetInviteCode } from "@/features/workspaces/api/use-reset-invite-code";
import { Input } from "@/components/ui/input";
import { DottedSeparator } from "@/components/dotted-separator";

type ResetInviteCodeProps = {
  workspace: Workspace;
};

const ResetInviteCode: React.FC<ResetInviteCodeProps> = ({ workspace }) => {
  const router = useRouter();

  const [ResetInviteCodeDialog, confirmResetInviteCode] = useConfirm(
    `Reset invite link for "${workspace.name}" workspace`,
    `Are you sure you want to reset invite link for "${workspace.name}" workspace? This action can not be undone.`,
    "destructive",
  );

  const { mutate, isPending } = useResetInviteCode();

  const handleResetInviteCode = async () => {
    const confirmed = await confirmResetInviteCode();
    if (!confirmed) {
      return;
    }

    mutate(
      {
        param: { workspaceId: workspace.$id },
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  };

  const fullInviteLink = `${window.location.origin}/workspaces/${workspace.$id}/join/${workspace.inviteCode}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(fullInviteLink).then(() => {
      toast.success("Invite link copied to clipboard");
    });
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <ResetInviteCodeDialog />
      <CardContent className="p-7">
        <div className="flex flex-col">
          <h3 className="font-bold">Invite Members</h3>
          <p className="text-sm text-muted-foreground">
            Use the invite link to add members to your workspace.
          </p>
          <div className="mt-4">
            <div className="flex items-center gap-x-2">
              <Input readOnly value={fullInviteLink} />
              <Button
                variant="secondary"
                className="size-12"
                onClick={handleCopyInviteLink}
              >
                <CopyIcon className="size-5" />
              </Button>
            </div>
          </div>
          <DottedSeparator className="py-7" />
          <Button
            className="mt-6 w-fit ml-auto"
            size="sm"
            variant="destructive"
            type="button"
            onClick={handleResetInviteCode}
            disabled={isPending}
          >
            Reset invite link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResetInviteCode;
