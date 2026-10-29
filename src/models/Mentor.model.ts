import mongoose, { Schema, Document } from "mongoose";
import { Mentor, MentorshipBooking } from "../types/mentor.js";

export type MentorDocument = Mentor & Document;
export type MentorshipBookingDocument = MentorshipBooking & Document;

const MentorSchema = new Schema<MentorDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    avatar: { type: String, required: true },
    rating: { type: Number, default: 4.9, min: 0, max: 5 },
    sessionsCount: { type: String, default: "10+ sessions" },
    bio: { type: String, required: true },
    skills: [{ type: String, trim: true }],
    experience: { type: String, required: true },
    pricePerSession: { type: String, required: true },
    priceNum: { type: Number, required: true, min: 0 },
    badge: { type: String },
    availability: { type: String, default: "This Week" },
    modes: [{ type: String }],
    languages: [{ type: String }]
  },
  { timestamps: true }
);

const MentorshipBookingSchema = new Schema<MentorshipBookingDocument>(
  {
    id: { type: String, required: true, unique: true },
    mentorId: { type: String, required: true, index: true },
    mentorName: { type: String, required: true, trim: true },
    sessionType: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    message: { type: String, trim: true, maxlength: 1000 },
    studentName: { type: String, required: true, trim: true },
    studentEmail: { type: String, required: true, lowercase: true, trim: true },
    studentPhone: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["confirmed", "completed", "cancelled"], default: "confirmed" }
  },
  { timestamps: true }
);

// Prevent double booking at the database level
MentorshipBookingSchema.index(
  { mentorId: 1, date: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: "cancelled" } } }
);

export const MentorModel = mongoose.model<MentorDocument>("Mentor", MentorSchema);
export const MentorshipBookingModel = mongoose.model<MentorshipBookingDocument>(
  "MentorshipBooking",
  MentorshipBookingSchema
);
