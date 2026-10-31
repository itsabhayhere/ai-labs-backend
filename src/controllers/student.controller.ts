import { Request, Response, NextFunction } from "express";
import { studentService } from "../services/student.service.js";
import { setAuthCookies, clearAuthCookies } from "../utils/cookie.js";

export const studentController = {
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const data = await studentService.getDashboard(userId);
      res.json({
        success: true,
        data,
        message: "Student dashboard telemetry retrieved successfully."
      });
    } catch (err) {
      next(err);
    }
  },

  async updateProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, progress, lessonId } = req.body;
      const userId = req.user?.id;

      const updated = await studentService.updateCourseProgress(
        userId,
        courseId,
        Number(progress),
        lessonId
      );

      res.json({
        success: true,
        message: "Course progress updated successfully.",
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await studentService.login(email, password);
      setAuthCookies(res, result.token, "student");

      res.json({
        success: true,
        message: `Welcome back, ${result.user.name}! Authentication verified.`,
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const result = await studentService.register(name, email, password);
      setAuthCookies(res, result.token, "student");

      res.status(201).json({
        success: true,
        message: `Account created successfully for ${result.user.name}. Welcome to Innovacio AI Labs.`,
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  async logout(_req: Request, res: Response, next: NextFunction) {
    try {
      clearAuthCookies(res);
      res.json({
        success: true,
        message: "Logged out successfully"
      });
    } catch (err) {
      next(err);
    }
  },

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const data = await studentService.getDashboard(userId);
      res.json({
        success: true,
        data: data.user,
        message: "Current student profile retrieved."
      });
    } catch (err) {
      next(err);
    }
  },

  async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, phone, preferredTrack } = req.body;
      const result = await studentService.sendRegistrationOtp(
        name,
        email,
        password,
        phone,
        preferredTrack
      );

      res.status(200).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      const result = await studentService.verifyRegistrationOtp(email, otp);

      res.status(201).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await studentService.resendRegistrationOtp(email);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
};
