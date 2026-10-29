import mongoose, { Schema, Document } from "mongoose";
import {
  CounselingInquiry,
  BrochureDownloadRequest,
  CampusVisitBooking
} from "../types/admissions.js";

export type CounselingDocument = CounselingInquiry & Document;
export type BrochureDocument = BrochureDownloadRequest & Document;
export type CampusVisitDocument = CampusVisitBooking & Document;

const CounselingSchema = new Schema<CounselingDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    program: { type: String, required: true, trim: true },
    mode: { type: String, enum: ["offline", "online", "hybrid"], default: "offline" },
    experience: {
      type: String,
      enum: ["student", "working_professional", "transitioning", "junior", "mid", "senior"],
      default: "student"
    },
    status: { type: String, enum: ["pending", "contacted", "admitted"], default: "pending" }
  },
  { timestamps: true }
);

const BrochureSchema = new Schema<BrochureDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    course: { type: String, default: "genai", trim: true }
  },
  { timestamps: true }
);

const CampusVisitSchema = new Schema<CampusVisitDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    programInterest: { type: String, required: true, trim: true },
    campusLocation: { type: String, default: "Park Street Campus, Kolkata" },
    status: { type: String, enum: ["scheduled", "visited", "cancelled"], default: "scheduled" }
  },
  { timestamps: true }
);

export const CounselingModel = mongoose.model<CounselingDocument>("Counseling", CounselingSchema);
export const BrochureModel = mongoose.model<BrochureDocument>("Brochure", BrochureSchema);
export const CampusVisitModel = mongoose.model<CampusVisitDocument>("CampusVisit", CampusVisitSchema);
