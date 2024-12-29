"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type JoinWorkspaceFormProps = {
  workspaceInfo: {
    name: string;
  };
};

export const JoinWorkspaceForm: React.FC<JoinWorkspaceFormProps> = ({
  workspaceInfo: { name },
}) => {
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
        <CardDescription>
          You &apos;ve been invited to join <strong>{name}</strong>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
