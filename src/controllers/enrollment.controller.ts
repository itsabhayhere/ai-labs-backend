import { Request, Response, NextFunction } from "express";
import { enrollmentService } from "../services/enrollment.service.js";

export const enrollmentController = {
  verifyCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, price } = req.body;
      const result = enrollmentService.verifyCoupon(code, price ? Number(price) : undefined);
      res.json({
        success: result.valid,
        message: result.message,
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  async checkout(req: Request, res: Response, next: NextFunction) {
    try {
      const enrollment = await enrollmentService.createCheckout(req.body);
      res.status(201).json({
        success: true,
        message: `Order submitted for "${enrollment.courseTitle}". Enrollment ID: ${enrollment.id}. Admissions will contact you for confirmation.`,
        data: enrollment
      });
    } catch (err) {
      next(err);
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const email = (req.query.email as string) || (req.user?.role === "student" ? req.user.email : undefined);
      const enrollments = await enrollmentService.getEnrollments(email);
      res.json({
        success: true,
        message: "Enrollments retrieved successfully.",
        data: enrollments
      });
    } catch (err) {
      next(err);
    }
  }
};
