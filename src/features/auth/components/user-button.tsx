"use client";

import React from "react";
import { Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dropdown,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DottedSeparator } from "@/components/dotted-separator";
import { useLogout } from "@/features/auth/api/use-logout";
import { useCurrent } from "@/features/auth/api/use-current";

export const UserButton: React.FC = () => {
  const { data: user, isLoading } = useCurrent();

  if (isLoading) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const { name, email } = user;
  const avatarFallback = (name || email || "U").charAt(0).toUpperCase();

  return (
    <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300 cursor-pointer">
      <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
        {avatarFallback}
      </AvatarFallback>
    </Avatar>
  );
};
