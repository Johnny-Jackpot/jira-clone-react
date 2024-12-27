"use server";

import { createSessionClient } from "@/lib/appwrite";
import { redirect } from "next/navigation";
import { routes } from "@/features/routes";

export const getCurrentUser = async () => {
  try {
    const { account } = await createSessionClient();

    return await account.get();
  } catch (e) {
    return null;
  }
};

export const redirectToLoginIfNoUser = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect(routes.auth.signIn);
  }
};
