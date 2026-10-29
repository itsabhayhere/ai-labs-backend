import { z } from "zod";

export const mentorQuerySchema = z.object({
  category: z.string().trim().optional(),
  search: z.string().trim().optional(),
  maxPrice: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  mode: z.string().trim().optional()
});

export const mentorIdParamSchema = z.object({
  id: z.string().trim().min(1).regex(/^[a-zA-Z0-9_-]+$/, "Invalid mentor ID")
});

export const createBookingSchema = z.object({
  mentorId: z.string().trim().min(1),
  sessionType: z.string().trim().min(2).max(100),
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  timeSlot: z.string().trim().min(2).max(50),
  message: z.string().trim().max(1000).optional(),
  studentName: z.string().trim().min(2, "Student name is required").max(100),
  studentEmail: z.string().trim().email("Valid student email required"),
  studentPhone: z.string().trim().min(8, "Valid student phone required").max(20)
});
