import { z } from "zod";

export const courseQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  level: z.string().trim().optional(),
  popular: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  sort: z.string().trim().optional()
});

export const courseSlugOrIdParamSchema = z.object({
  slugOrId: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-zA-Z0-9_-]+$/, "Invalid course identifier format")
});

export const courseSlugParamSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-zA-Z0-9_-]+$/, "Invalid course slug format")
});

export const createCourseSchema = z.object({
  title: z.string().trim().min(3).max(200),
  category: z.string().trim().min(2),
  level: z.string().trim().min(2),
  duration: z.string().trim().min(2),
  format: z.string().trim().min(2),
  shortDesc: z.string().trim().min(10).max(500),
  thumbnail: z.string().trim().url(),
  instructor: z.string().trim().min(2),
  instructorRole: z.string().trim().min(2),
  price: z.string().trim().min(1),
  originalPrice: z.string().trim().min(1),
  discount: z.string().trim().min(1),
  saveAmount: z.string().trim().min(1),
  emi: z.string().trim().min(1)
});
