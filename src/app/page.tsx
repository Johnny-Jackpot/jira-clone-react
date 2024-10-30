"use client";

import { useCurrent } from "@/features/auth/api/use-current";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/features/routes";
import { useLogout } from "@/features/auth/api/use-logout";
import { Button } from "@/components/ui/button";

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
      Only visible to authorized users
      <Button onClick={() => mutate()}>Logout</Button>
    </div>
  );
}
