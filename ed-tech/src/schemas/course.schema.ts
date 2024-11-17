import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const courseSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  description: z.string().min(10, { message: "Description is required" }),
  price: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: "Price must be a valid number",
    }),
  thumbnail:  typeof window === "undefined"
  ? z.any().nullable()
  : z
      .instanceof(FileList)
    .refine((value) => value.length > 0)
    .refine((files) => {
      const file = files?.item(0);
      if (!file) return false;

      return ACCEPTED_IMAGE_TYPES.includes(file?.type);
    }),
  sections: z.array(
    z.object({
      title: z.string().min(2, { message: "Title is required" }),
      video: typeof window === "undefined"
      ? z.any().nullable()
      : z
          .instanceof(FileList)
        .refine((value) => value.length > 0)
        .refine((files) => {
          const file = files?.item(0);
          if (!file) return false;

          return file.type.includes("video");
        }),
    })
  ),
});
