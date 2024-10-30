import "server-only";

import { Client, Account, Storage, Users, Databases } from "node-appwrite";

export function getClient(): Client {
  return new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);
}

export async function createAdminClient() {
  return {
    get account() {
      return new Account(getClient().setKey(process.env.NEXT_APPWRITE_KEY));
    },
  };
}
