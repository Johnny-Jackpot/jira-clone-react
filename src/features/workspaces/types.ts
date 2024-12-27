import { Models } from "node-appwrite";

export type Workspace = Models.Document & {
  name: string;
  userId: string;
  imagePreview: string;
  imageId: string;
  inviteCode: string;
};
