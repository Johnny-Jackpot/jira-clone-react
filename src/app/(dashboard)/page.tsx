import { getCurrentUser } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import { routes } from "@/features/routes";
import {CreateWorkspaceForm} from "@/features/workspaces/components/create-workspace-form";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(routes.auth.signIn);
  }

  return <div>
    <CreateWorkspaceForm />
  </div>;
}
