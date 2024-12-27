import { redirectToLoginIfNoUser } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import { getWorkspaces } from "@/features/workspaces/actions";

export default async function Home() {
  await redirectToLoginIfNoUser();

  const workspaces = await getWorkspaces();
  if (!workspaces || workspaces.total === 0) {
    redirect("/workspaces/create");
  }

  redirect(`/workspaces/${workspaces.documents[0].$id}`);
}
