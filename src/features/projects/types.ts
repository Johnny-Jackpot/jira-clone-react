import { Models } from "node-appwrite";

export type Project = Models.Document & {
  name: string;
  imagePreview: string | null;
  imageId: string | null;
  workspaceId: string;
};
