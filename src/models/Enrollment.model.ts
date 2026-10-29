import mongoose, { Schema, Document } from "mongoose";
import { Enrollment } from "../types/enrollment.js";

export type EnrollmentDocument = Enrollment & Document;

const EnrollmentSchema = new Schema<EnrollmentDocument>(
  {
    id: { type: String, required: true, unique: true },
    courseId: { type: String, required: true, index: true },
    courseTitle: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    mode: { type: String, enum: ["hybrid", "online", "offline"], default: "hybrid" },
    experience: {
      type: String,
      enum: ["student", "working_professional", "transitioning"],
      default: "working_professional"
    },
    paymentOption: { type: String, enum: ["full", "deposit", "emi"], default: "full" },
    couponCode: { type: String, trim: true },
    discountApplied: { type: Number, default: 0, min: 0 },
    finalPrice: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending"
    },
    status: {
      type: String,
      enum: ["confirmed", "pending_payment", "cancelled"],
      default: "pending_payment"
    }
  },
  { timestamps: true }
);

EnrollmentSchema.index({ email: 1, courseId: 1, status: 1 });

export const EnrollmentModel = mongoose.model<EnrollmentDocument>(
  "Enrollment",
  EnrollmentSchema
);
