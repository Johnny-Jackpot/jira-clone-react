import { z } from "zod";

const shape = {
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
};

export const createWorkspaceSchema = z.object(shape);
export const updateWorkspaceSchema = z.object({
  ...shape,
  //if no name is provided, it will be considered that we don't want to update it
  name: z.string().trim().min(1, "Must be at least 1 character").optional(),
});
