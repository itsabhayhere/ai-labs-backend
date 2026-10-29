import { z } from "zod";

export const discussionQuerySchema = z.object({
  tab: z.enum(["latest", "trending", "unanswered", "my-posts"]).optional(),
  category: z.string().trim().optional(),
  search: z.string().trim().optional()
});

export const discussionIdParamSchema = z.object({
  id: z
    .string()
    .trim()
    .regex(/^\d+$/, "Discussion ID must be an integer")
    .transform((val) => parseInt(val, 10))
});

export const createPostSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(250),
  content: z.string().trim().min(10, "Content must be at least 10 characters").max(5000),
  category: z.string().trim().min(2, "Category is required").max(100),
  tags: z.array(z.string().trim().max(50)).optional(),
  authorName: z.string().trim().max(100).optional(),
  authorRole: z.enum(["Instructor", "Student", "Mentor", "Alumni"]).optional()
});

export const replySchema = z.object({
  content: z.string().trim().min(2, "Reply must be at least 2 characters").max(2000),
  author: z
    .object({
      name: z.string().trim().max(100).optional(),
      role: z.enum(["Instructor", "Student", "Mentor", "Alumni"]).optional(),
      avatar: z.string().url().optional()
    })
    .optional()
});
