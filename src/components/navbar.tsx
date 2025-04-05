"use client";

import React from "react";
import { UserButton } from "@/features/auth/components/user-button";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { usePathname } from "next/navigation";

const pathnameMap = {
  tasks: { title: "My Tasks", description: "View all of your tasks here" },
  projects: {
    title: "My Projects",
    description: "View tasks of your projects here",
  },
};

const defaultMap = {
  title: "Home",
  description: "Monitor all of your projects and tasks here",
};

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  const pathnameKey = pathnameParts[3];

  const { title, description } =
    pathnameKey in pathnameMap
      ? pathnameMap[pathnameKey as keyof typeof pathnameMap]
      : defaultMap;

  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};
