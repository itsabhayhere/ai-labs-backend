import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Please provide a valid administrator email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100)
});

export const adminStudentQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10) || 1) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10) || 20)) : 20)),
  search: z.string().trim().optional(),
  batch: z.string().trim().optional(),
  campus: z.string().trim().optional(),
  role: z.enum(["student", "alumni", "admin"]).optional(),
  courseId: z.string().trim().optional(),
  sort: z.enum(["name-asc", "name-desc", "date-asc", "date-desc"]).optional()
});

export const adminCourseQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10) || 1) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10) || 20)) : 20)),
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  level: z.string().trim().optional(),
  sort: z
    .enum(["price-asc", "price-desc", "rating", "popular", "date-asc", "date-desc"])
    .optional()
});

export const adminStudentIdParamSchema = z.object({
  id: z.string().trim().min(1, "Student ID is required")
});

export const adminUpdateStudentSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  role: z.enum(["student", "alumni", "admin"]).optional(),
  batch: z.string().trim().min(2).max(100).optional(),
  campus: z.string().trim().min(2).max(150).optional(),
  avatar: z.string().trim().url().optional()
});

