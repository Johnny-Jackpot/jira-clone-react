import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type MemberAvatarProps = {
  name: string;
  className?: string;
  fallbackClassName?: string;
};

export const MemberAvatar: React.FC<MemberAvatarProps> = ({
  name,
  className,
  fallbackClassName,
}) => {
  return (
    <Avatar
      className={cn(
        "size-5 transition border border-neutral-300 rounded-full",
        className,
      )}
    >
      <AvatarFallback
        className={cn(
          "bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center uppercase",
          fallbackClassName,
        )}
      >
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
};