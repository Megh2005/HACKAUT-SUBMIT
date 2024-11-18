import { z } from "zod";

export const recommendationSchema = z.object({
  skills: z.string().min(1, { message: "Skills are required" }),
  levelOfExperience: z.string({ message: "Level of experience is required" }),
  commitmentTime: z.string({ message: "Commitment time is required" }),
});
