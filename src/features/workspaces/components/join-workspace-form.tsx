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
  name: string;
};

export const JoinWorkspaceForm: React.FC<JoinWorkspaceFormProps> = ({
  name,
}) => {
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
      </CardHeader>
      <CardDescription>
        You &apos;ve been invited to join <strong>{name}</strong>
      </CardDescription>
    </Card>
  );
};
