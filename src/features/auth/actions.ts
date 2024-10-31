"use server";

import { cookies } from "next/headers";
import { getAppWriteClient } from "@/lib/appwrite";
import { AUTH_COOKIE } from "@/features/auth/constants";
import { Account } from "node-appwrite";

export const getCurrentUser = async () => {
  try {
    const requestCookies = await cookies();
    const sessionId = requestCookies.get(AUTH_COOKIE);
    if (!sessionId) {
      return null;
    }

    const account = new Account(getAppWriteClient().setSession(sessionId.value));
    return await account.get();
  } catch (e) {
    return null;
  }
};
