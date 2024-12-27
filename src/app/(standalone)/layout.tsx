import React from "react";
import Link from "next/link";
import Image from "next/image";
import {UserButton} from "@/features/auth/components/user-button";

type StandaloneLayoutProps = {
  children: React.ReactNode;
};

const StandaloneLayout: React.FC<StandaloneLayoutProps> = ({ children }) => {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[73px]">
          <Link href="/">
            <Image src="/logo.svg" alt="Logo" width={151} height={56} />
          </Link>
          <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandaloneLayout;
