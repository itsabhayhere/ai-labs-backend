import mongoose, { Schema, Document } from "mongoose";
import { StudentUser, StudentDashboardCourse } from "../types/student.js";

export type StudentUserDocument = Omit<StudentUser, "id"> & Document & {
  id: string;
  comparePassword?: (password: string) => Promise<boolean>;
};

const EnrolledCourseSchema = new Schema<StudentDashboardCourse>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    thumbnail: { type: String, required: true },
    week: { type: String, default: "Week 1 of 12" },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completedLessons: [{ type: String }],
    status: { type: String, enum: ["in-progress", "completed"], default: "in-progress" },
    nextClass: { type: String, default: "Saturday 10:00 AM IST" }
  },
  { _id: false }
);

const StudentUserSchema = new Schema<StudentUserDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    avatar: {
      type: String,
      default: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
    },
    role: { type: String, enum: ["student", "alumni", "admin"], default: "student" },
    batch: { type: String, default: "Nov 2026 Cohort" },
    campus: { type: String, default: "Park Street Campus, Kolkata" },
    enrolledCourses: { type: [EnrolledCourseSchema], default: [] }
  },
  { timestamps: true }
);

export const StudentUserModel = mongoose.model<StudentUserDocument>(
  "StudentUser",
  StudentUserSchema
);
