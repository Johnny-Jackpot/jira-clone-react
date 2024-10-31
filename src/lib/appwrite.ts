import "server-only";

import { Client, Account } from "node-appwrite";

export function getAppWriteClient(): Client {
  return new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);
}

export async function createAdminClient() {
  return {
    get account() {
      return new Account(
        getAppWriteClient().setKey(process.env.NEXT_APPWRITE_KEY),
      );
    },
  };
}
