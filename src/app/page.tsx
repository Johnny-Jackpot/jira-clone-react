import { UserButton } from "@/features/auth/components/user-button";
import { getCurrentUser } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import { routes } from "@/features/routes";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(routes.auth.signIn);
  }

  return (
    <div>
      <UserButton />
    </div>
  );
}
