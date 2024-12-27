import { z } from "zod";

export const workspaceSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z
    .union([
      z.instanceof(File),
      z.instanceof(Blob).transform((blob: Blob | File) => {
        /*
          Weird case on Windows 10
          Debugger panel shows that this is a File
          but 'instance of File' returns false
         */
        if (blob.constructor.name !== "File") {
          throw new Error("Invalid File");
        }

        return new File([blob], blob.name, { type: blob.type });
      }),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});
