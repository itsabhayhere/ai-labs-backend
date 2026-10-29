import { z } from "zod";

export const progressUpdateSchema = z.object({
  courseId: z.string().trim().min(1, "courseId is required"),
  progress: z.number().min(0, "Progress cannot be negative").max(100, "Progress cannot exceed 100%"),
  lessonId: z.string().trim().optional()
});
