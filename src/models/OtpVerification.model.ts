import mongoose, { Schema, Document } from "mongoose";

export interface OtpVerificationDocument extends Document {
  email: string;
  otp: string;
  name: string;
  password?: string;
  phone?: string;
  preferredTrack?: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

const OtpVerificationSchema = new Schema<OtpVerificationDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    otp: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String
    },
    phone: {
      type: String,
      trim: true
    },
    preferredTrack: {
      type: String,
      trim: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // MongoDB TTL index to auto-remove expired documents
    },
    attempts: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export const OtpVerificationModel = mongoose.model<OtpVerificationDocument>(
  "OtpVerification",
  OtpVerificationSchema
);
