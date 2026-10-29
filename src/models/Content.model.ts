import mongoose, { Schema, Document } from "mongoose";
import { FAQItem, Testimonial } from "../types/content.js";

export type FaqDocument = FAQItem & Document;
export type TestimonialDocument = Testimonial & Document;

const FaqSchema = new Schema<FaqDocument>(
  {
    category: {
      type: String,
      enum: ["admissions", "curriculum", "placements", "campus", "all"],
      required: true,
      index: true
    },
    question: { type: String, required: true },
    answer: { type: String, required: true }
  },
  { timestamps: true }
);

const TestimonialSchema = new Schema<TestimonialDocument>(
  {
    name: { type: String, required: true },
    program: { type: String, required: true },
    location: { type: String, required: true },
    beforeRole: { type: String, required: true },
    beforeComp: { type: String, required: true },
    currentRole: { type: String, required: true },
    currentComp: { type: String, required: true },
    company: { type: String, required: true },
    quote: { type: String, required: true },
    avatar: { type: String },
    role: { type: String },
    badge: { type: String }
  },
  { timestamps: true }
);

export const FaqModel = mongoose.model<FaqDocument>("Faq", FaqSchema);
export const TestimonialModel = mongoose.model<TestimonialDocument>("Testimonial", TestimonialSchema);
