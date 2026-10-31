import { z } from "zod";

export const courseDurationSchema = z.object({
  total: z.string().trim().min(1, "Duration total is required"),
  breakdown: z.string().trim().min(1, "Duration breakdown is required")
});

export const curriculumAdvancedPhaseSchema = z.object({
  timeframe: z.string().trim().min(1, "Timeframe is required"),
  module: z.string().trim().min(1, "Module is required"),
  coreTopics: z.array(z.string().trim().min(1)),
  assignmentTypes: z.array(z.string().trim().min(1))
});

export const curriculumAiIntegrationPhaseSchema = z.object({
  topics: z.array(z.string().trim().min(1))
});

export const curriculumAdvancedPlusPhaseSchema = z.object({
  moduleNumber: z.number().int().positive(),
  moduleName: z.string().trim().min(1, "Module name is required"),
  relevantTopics: z.array(z.string().trim().min(1))
});

export const courseCurriculumSchema = z.object({
  advancedPhase: z.array(curriculumAdvancedPhaseSchema),
  aiIntegrationPhase: curriculumAiIntegrationPhaseSchema,
  advancedPlusPhase: z.array(curriculumAdvancedPlusPhaseSchema)
});

export const projectCheckpointSchema = z.object({
  checkpoint: z.string().trim().min(1, "Checkpoint is required"),
  description: z.string().trim().min(1, "Description is required")
});

export const careerSupportItemSchema = z.object({
  service: z.string().trim().min(1, "Service is required"),
  details: z.string().trim().min(1, "Details are required")
});

export const successMetricSchema = z.object({
  metric: z.string().trim().min(1, "Metric is required"),
  description: z.string().trim().min(1, "Description is required")
});

export const createCourseSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200),
  positioning: z.string().trim().min(5, "Positioning is required"),
  audience: z.string().trim().min(5, "Audience is required"),
  duration: courseDurationSchema,
  coreStack: z.array(z.string().trim().min(1)).min(1, "Core stack must include at least one technology"),
  curriculum: courseCurriculumSchema,
  projectCheckpoints: z.array(projectCheckpointSchema).min(1, "At least one project checkpoint is required"),
  careerSupportBundle: z.array(careerSupportItemSchema).min(1, "At least one career support item is required"),
  successMetrics: z.array(successMetricSchema).min(1, "At least one success metric is required")
});

export const updateCourseSchema = createCourseSchema.partial();

export const courseQuerySchema = z.object({
  search: z.string().trim().optional(),
  sort: z.enum(["title-asc", "title-desc", "newest", "oldest"]).optional(),
  page: z.string().optional().transform((val) => (val ? Math.max(1, parseInt(val, 10) || 1) : 1)),
  limit: z.string().optional().transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10) || 20)) : 20))
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
