import {
  ID,
  Models,
  type Storage as StorageType,
  type Databases as DatabasesType,
} from "node-appwrite";
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/config";

export class WorkspaceService {
  constructor(
    protected storage: StorageType,
    protected databases: DatabasesType,
  ) {}

  public async uploadImage(image: File, workspace: Models.Document) {
    const file = await this.storage.createFile(
      IMAGES_BUCKET_ID,
      ID.unique(),
      image,
    );
    const arrayBuffer = await this.storage.getFilePreview(
      IMAGES_BUCKET_ID,
      file.$id,
    );

    return await this.databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspace.$id,
      {
        imagePreview: `data:image/png;base64${Buffer.from(arrayBuffer).toString("base64")}`,
        imageId: file.$id,
      },
    );
  }
}
