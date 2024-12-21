import { getCurrentUser } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import { routes } from "@/features/routes";
import { getWorkspaces } from "@/features/workspaces/actions";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(routes.auth.signIn);
  }

  const workspaces = await getWorkspaces();
  if (!workspaces || workspaces.total === 0) {
    redirect("/workspaces/create");
  }

  redirect(`/workspaces/${workspaces.documents[0].$id}`);
}
