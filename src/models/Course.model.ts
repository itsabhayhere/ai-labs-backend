import mongoose, { Schema, Document } from "mongoose";
import { Course } from "../types/course.js";

export type CourseDocument = Course & Document;

const CourseModuleSchema = new Schema(
  {
    week: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    lecturesCount: { type: Number, default: 0 },
    hoursCount: { type: Number, default: 0 }
  },
  { _id: false }
);

const CourseSchema = new Schema<CourseDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true, index: true },
    badge: { type: String },
    isMostPopular: { type: Boolean, default: false },
    level: { type: String, required: true },
    duration: { type: String, required: true },
    format: { type: String, required: true },
    title: { type: String, required: true },
    shortDesc: { type: String, required: true },
    fullDesc: { type: String },
    thumbnail: { type: String, required: true },
    rating: { type: Number, default: 4.9 },
    reviewsCount: { type: Number, default: 0 },
    instructor: { type: String, required: true },
    instructorRole: { type: String, required: true },
    price: { type: String, required: true },
    originalPrice: { type: String, required: true },
    discount: { type: String, required: true },
    saveAmount: { type: String, required: true },
    emi: { type: String, required: true },
    seatsLeft: { type: Number, default: 10 },
    isBestseller: { type: Boolean, default: false },
    enrolledCount: { type: String, default: "0 Enrolled" },
    startDate: { type: String },
    schedule: { type: String },
    highlights: [{ type: String }],
    tools: [{ type: String }],
    modules: [CourseModuleSchema],
    capstone: { type: String },
    whatYouWillLearn: [{ type: String }],
    prerequisites: [{ type: String }]
  },
  { timestamps: true }
);

export const CourseModel = mongoose.model<CourseDocument>("Course", CourseSchema);
