import {z} from "zod";

const passwordMinLength = 8;
const passwordMaxLength = 256;

const signInShape = {
  email: z.string().email(),
  password: z
    .string()
    .min(passwordMinLength, `Minimum ${passwordMinLength} characters`)
    .max(passwordMaxLength, `Maximum ${passwordMaxLength} characters`),
};

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(passwordMinLength, `Minimum ${passwordMinLength} characters`)
    .max(passwordMaxLength, `Maximum ${passwordMaxLength} characters`),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  ...signInShape,
});