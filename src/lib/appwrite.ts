import "server-only";

import { Client, Account, Databases, Users } from "node-appwrite";
import { AUTH_COOKIE } from "@/features/auth/constants";
import { cookies } from "next/headers";

export function getAppWriteClient(): Client {
  return new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
}

export async function createAdminClient() {
  const client = getAppWriteClient().setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get users() {
      return new Users(client);
    },
  };
}

export async function createSessionClient() {
  const requestCookies = await cookies();
  const sessionId = requestCookies.get(AUTH_COOKIE);
  if (!sessionId || !sessionId.value) {
    throw new Error("Unauthorized");
  }

  const client = getAppWriteClient();
  client.setSession(sessionId.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
}
