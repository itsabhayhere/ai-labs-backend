import { z } from "zod";

export const counselingSchema = z.object({
  name: z.string().trim().min(2, "Full legal name is required").max(100).optional(),
  fullName: z.string().trim().min(2).max(100).optional(),
  email: z.string().trim().email("Please enter a valid email address").optional().or(z.literal("")),
  phone: z.string().trim().min(8, "Please enter a valid phone number").max(20),
  program: z.string().trim().min(2, "Please select a program track"),
  mode: z.enum(["offline", "online", "hybrid"]).default("offline").optional(),
  experience: z
    .enum(["student", "working_professional", "transitioning", "junior", "mid", "senior"])
    .default("student")
    .optional(),
  notes: z.string().trim().max(1000).optional()
}).refine((data) => Boolean(data.name || data.fullName), {
  message: "Full legal name is required",
  path: ["name"]
});

export const brochureSchema = z.object({
  name: z.string().trim().min(2, "Full legal name is required").max(100),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().min(8, "Please enter a valid phone number").max(20),
  course: z.string().trim().default("genai")
});

export const campusVisitSchema = z.object({
  name: z.string().trim().min(2, "Full legal name is required").max(100),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().min(8, "Please enter a valid phone number").max(20),
  date: z.string().trim().min(5),
  time: z.string().trim().min(2),
  programInterest: z.string().trim().min(2, "Program interest is required")
});
