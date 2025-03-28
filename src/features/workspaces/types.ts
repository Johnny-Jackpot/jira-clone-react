import { Models } from "node-appwrite";

export type Workspace = Models.Document & {
  name: string;
  userId: string;
  imagePreview: string | null;
  imageId: string | null;
  inviteCode: string;
};
