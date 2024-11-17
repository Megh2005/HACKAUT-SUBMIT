import { PASSWORD_REGEX } from "@/utils/constants";
import { z } from "zod";
const MAX_FILE_SIZE = 4000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const signupSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(PASSWORD_REGEX, {
      message:
        "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
    }),
  displayName: z
    .string()
    .min(3, { message: "Name should be at least 3 characters long." }),
  photo:
    typeof window === "undefined"
      ? z.any().nullable()
      : z
          .instanceof(FileList)
          .nullable()
          .refine(
            (files) => {
              const file = files?.item(0);
              if (!file) return true;

              return file?.size <= MAX_FILE_SIZE;
            },
            {
              message: `Image size should be less than ${
                MAX_FILE_SIZE / 1000000
              }MB.`,
            }
          )
          .refine(
            (files) => {
              const file = files?.item(0);
              if (!file) return true;

              return ACCEPTED_IMAGE_TYPES.includes(file?.type);
            },
            { message: "Only JPEG, JPG, and PNG images are allowed." }
          ),
});
