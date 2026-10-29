import mongoose from "mongoose";
import { FAQS, TESTIMONIALS } from "../data/seedData.js";
import { FAQItem, Testimonial } from "../types/content.js";
import { FaqModel, TestimonialModel } from "../models/Content.model.js";

function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export const contentService = {
  async getFaqs(category?: string): Promise<FAQItem[]> {
    if (isDbConnected()) {
      const query: any = {};
      if (category && category !== "all") {
        query.category = { $regex: new RegExp(`^${category}$`, "i") };
      }
      const docs = await FaqModel.find(query).lean();
      if (docs.length > 0) return docs as unknown as FAQItem[];
    }

    if (!category || category === "all") {
      return FAQS;
    }
    return FAQS.filter(
      (f) => f.category.toLowerCase() === category.toLowerCase()
    );
  },

  async getTestimonials(): Promise<Testimonial[]> {
    if (isDbConnected()) {
      const docs = await TestimonialModel.find().lean();
      if (docs.length > 0) return docs as unknown as Testimonial[];
    }
    return TESTIMONIALS;
  }
};
