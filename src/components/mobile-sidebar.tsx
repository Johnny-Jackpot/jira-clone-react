"use client";

import React, { useEffect, useState } from "react";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";

export const MobileSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="lg:hidden">
          <MenuIcon className="size-4 text-neutral-500" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <VisuallyHidden.Root>
          <SheetTitle>Menu</SheetTitle>
        </VisuallyHidden.Root>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
