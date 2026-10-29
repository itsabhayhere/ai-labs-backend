import { Request, Response, NextFunction } from "express";
import { contentService } from "../services/content.service.js";

export const contentController = {
  async getFaqs(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.query;
      const faqs = await contentService.getFaqs(category as string);
      res.json({
        success: true,
        message: "Frequently asked questions retrieved.",
        count: faqs.length,
        data: faqs
      });
    } catch (err) {
      next(err);
    }
  },

  async getTestimonials(_req: Request, res: Response, next: NextFunction) {
    try {
      const testimonials = await contentService.getTestimonials();
      res.json({
        success: true,
        message: "Verified testimonials retrieved.",
        count: testimonials.length,
        data: testimonials
      });
    } catch (err) {
      next(err);
    }
  }
};
