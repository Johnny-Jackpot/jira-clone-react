import React from "react";
import { useMedia } from "react-use";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

type ResponsiveModalProps = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  children,
  open,
  onOpenChange,
}) => {
  const isDesktop = useMedia("(min-width: 1024px)", true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
          <VisuallyHidden.Root>
            <DialogTitle>Create workspace modal</DialogTitle>
          </VisuallyHidden.Root>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <VisuallyHidden.Root>
          <DrawerTitle>Create workspace modal</DrawerTitle>
        </VisuallyHidden.Root>
        <div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
