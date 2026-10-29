import { Request, Response, NextFunction } from "express";
import { admissionsService } from "../services/admissions.service.js";

export const admissionsController = {
  async createCounseling(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, fullName, email, phone, program, mode, experience, notes } = req.body;
      const inquiry = await admissionsService.createCounseling({
        name: name || fullName,
        email: email || "admissions-lead@innovaciotech.com",
        phone,
        program,
        mode: mode || "offline",
        experience: experience || "student",
        ...(notes ? { notes } : {})
      } as any);
      res.status(201).json({
        success: true,
        message: `Application received for ${inquiry.name}. Our admissions cell will contact you shortly.`,
        data: inquiry
      });
    } catch (err) {
      next(err);
    }
  },

  async getCounselings(_req: Request, res: Response, next: NextFunction) {
    try {
      const inquiries = await admissionsService.getCounselings();
      res.json({
        success: true,
        count: inquiries.length,
        data: inquiries
      });
    } catch (err) {
      next(err);
    }
  },

  async createBrochure(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, phone, course } = req.body;
      const request = await admissionsService.createBrochureRequest({
        name,
        email,
        phone,
        course: course || "genai"
      });

      res.status(201).json({
        success: true,
        message: `The 2026 Academic Prospectus has been generated for ${request.email}.`,
        data: {
          request,
          prospectus: {
            title: "Innovacio AI Labs - 2026 Academic Prospectus & Compute Allocation Specs",
            course: request.course,
            deliveryStatus: "dispatched",
            downloadAvailable: true
          }
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async getBrochures(_req: Request, res: Response, next: NextFunction) {
    try {
      const brochures = await admissionsService.getBrochureRequests();
      res.json({
        success: true,
        count: brochures.length,
        data: brochures
      });
    } catch (err) {
      next(err);
    }
  },

  async createCampusVisit(req: Request, res: Response, next: NextFunction) {
    try {
      const visit = await admissionsService.createCampusVisit(req.body);
      res.status(201).json({
        success: true,
        message: `Campus visit scheduled for ${visit.name} at Park Street, Kolkata on ${visit.date} at ${visit.time}!`,
        data: visit
      });
    } catch (err) {
      next(err);
    }
  },

  async getCampusVisits(_req: Request, res: Response, next: NextFunction) {
    try {
      const visits = await admissionsService.getCampusVisits();
      res.json({
        success: true,
        count: visits.length,
        data: visits
      });
    } catch (err) {
      next(err);
    }
  }
};
