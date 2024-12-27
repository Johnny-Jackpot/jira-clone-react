import { ID, Models, type Storage } from "node-appwrite";
import { IMAGES_BUCKET_ID } from "@/config";

export const imagesUtils = {
  async storeImage(storage: Storage, image: File | string | undefined) {
    let storedImage: Models.File | undefined = undefined;
    let imagePreview: string | undefined = undefined;

    if (!(image instanceof File)) {
      return { storedImage, imagePreview };
    }

    storedImage = await storage.createFile(
      IMAGES_BUCKET_ID,
      ID.unique(),
      image,
    );
    const arrayBuffer = await storage.getFilePreview(
      IMAGES_BUCKET_ID,
      storedImage.$id,
    );

    imagePreview = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;

    return { storedImage, imagePreview };
  },
};
