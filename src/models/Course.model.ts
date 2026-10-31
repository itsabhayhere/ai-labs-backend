import mongoose, { Schema, Document } from "mongoose";
import { Course } from "../types/course.js";

export type CourseDocument = Course & Document;

const CourseDurationSchema = new Schema(
  {
    total: { type: String, required: true },
    breakdown: { type: String, required: true }
  },
  { _id: false }
);

const CurriculumAdvancedPhaseSchema = new Schema(
  {
    timeframe: { type: String, required: true },
    module: { type: String, required: true },
    coreTopics: [{ type: String, required: true }],
    assignmentTypes: [{ type: String, required: true }]
  },
  { _id: false }
);

const CurriculumAiIntegrationPhaseSchema = new Schema(
  {
    topics: [{ type: String, required: true }]
  },
  { _id: false }
);

const CurriculumAdvancedPlusPhaseSchema = new Schema(
  {
    moduleNumber: { type: Number, required: true },
    moduleName: { type: String, required: true },
    relevantTopics: [{ type: String, required: true }]
  },
  { _id: false }
);

const CourseCurriculumSchema = new Schema(
  {
    advancedPhase: { type: [CurriculumAdvancedPhaseSchema], required: true },
    aiIntegrationPhase: { type: CurriculumAiIntegrationPhaseSchema, required: true },
    advancedPlusPhase: { type: [CurriculumAdvancedPlusPhaseSchema], required: true }
  },
  { _id: false }
);

const ProjectCheckpointSchema = new Schema(
  {
    checkpoint: { type: String, required: true },
    description: { type: String, required: true }
  },
  { _id: false }
);

const CareerSupportItemSchema = new Schema(
  {
    service: { type: String, required: true },
    details: { type: String, required: true }
  },
  { _id: false }
);

const SuccessMetricSchema = new Schema(
  {
    metric: { type: String, required: true },
    description: { type: String, required: true }
  },
  { _id: false }
);

const CourseSchema = new Schema<CourseDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: true },
    positioning: { type: String, required: true },
    audience: { type: String, required: true },
    duration: { type: CourseDurationSchema, required: true },
    coreStack: [{ type: String, required: true }],
    curriculum: { type: CourseCurriculumSchema, required: true },
    projectCheckpoints: { type: [ProjectCheckpointSchema], required: true },
    careerSupportBundle: { type: [CareerSupportItemSchema], required: true },
    successMetrics: { type: [SuccessMetricSchema], required: true }
  },
  { timestamps: true }
);

export const CourseModel = mongoose.model<CourseDocument>("Course", CourseSchema);
