import React from "react";
import Link from "next/link";
import Image from "next/image";
import { DottedSeparator } from "@/components/dotted-separator";
import { Navigation } from "@/components/navigation";

export const Sidebar: React.FC = () => {
  return (
    <aside className="h-full w-full p-4 bg-neutral-100">
      <Link href="/">
        <Image src="/logo.svg" alt="logo" width={164} height={48} />
      </Link>
      <DottedSeparator className="my-4" />
      <Navigation />
    </aside>
  );
};
