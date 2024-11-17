import { PASSWORD_REGEX } from "@/utils/constants";
import { z } from "zod";

export const signupSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be atleast 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .regex(PASSWORD_REGEX, {
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
  role: z.enum(["creator", "learner"], { message: "Invalid role" }),
});
