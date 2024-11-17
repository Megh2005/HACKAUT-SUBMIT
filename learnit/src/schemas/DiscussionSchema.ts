import { z } from "zod";
const MAX_FILE_SIZE = 4000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const discussionSchema = z.object({
  title: z
    .string()
    .max(150, { message: "Title should be less than 150 characters" })
    .min(10, { message: "Title should be at least 10 characters" }),
  description: z
    .string()
    .min(10, { message: "Description should be at least 10 characters" }),
  attachment:
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

export const tagSchema = z
  .array(z.string())
  .max(3, { message: "You can only add up to 3 tags" })
  .min(1, { message: "You need to add at least 1 tag" });
