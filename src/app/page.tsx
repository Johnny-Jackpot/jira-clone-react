"use client";

import { useCurrent } from "@/features/auth/api/use-current";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/features/routes";
import { useLogout } from "@/features/auth/api/use-logout";
import { UserButton } from "@/features/auth/components/user-button";

export default function Home() {
  const router = useRouter();
  const { data, isLoading } = useCurrent();
  const { mutate } = useLogout();

  useEffect(() => {
    if (!data && !isLoading) {
      router.push(routes.auth.signIn);
    }
  }, [data]);

  return (
    <div>
      <UserButton />
    </div>
  );
}
