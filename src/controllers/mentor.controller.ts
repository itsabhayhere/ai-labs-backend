import { Request, Response, NextFunction } from "express";
import { mentorService } from "../services/mentor.service.js";

export const mentorController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, search, maxPrice, mode } = req.query;
      const mentors = await mentorService.getAll({
        category: category ? String(category) : undefined,
        search: search ? String(search) : undefined,
        maxPrice: maxPrice ? parseInt(String(maxPrice), 10) : undefined,
        mode: mode ? String(mode) : undefined
      });

      res.json({
        success: true,
        message: "Mentors retrieved successfully.",
        count: mentors.length,
        data: mentors
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id || "");
      const mentor = await mentorService.getById(id);
      if (!mentor) {
        return res.status(404).json({
          success: false,
          error: {
            code: "MENTOR_NOT_FOUND",
            message: `Mentor not found for id '${id}'`
          }
        });
      }

      res.json({
        success: true,
        data: mentor
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const mentor = await mentorService.create(req.body);
      res.status(201).json({
        success: true,
        message: "Mentor created successfully.",
        data: mentor
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id || "");
      const mentor = await mentorService.update(id, req.body);
      if (!mentor) {
        return res.status(404).json({
          success: false,
          error: {
            code: "MENTOR_NOT_FOUND",
            message: `Mentor not found for id '${id}'`
          }
        });
      }

      res.json({
        success: true,
        message: "Mentor updated successfully.",
        data: mentor
      });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id || "");
      const deleted = await mentorService.delete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: {
            code: "MENTOR_NOT_FOUND",
            message: `Mentor not found for id '${id}'`
          }
        });
      }

      res.json({
        success: true,
        message: "Mentor deleted successfully."
      });
    } catch (err) {
      next(err);
    }
  },

  async createBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await mentorService.createBooking(req.body);
      res.status(201).json({
        success: true,
        message: `Mentorship booking confirmed with ${booking.mentorName} on ${booking.date} at ${booking.timeSlot}`,
        data: booking
      });
    } catch (err) {
      next(err);
    }
  },

  async getBookings(_req: Request, res: Response, next: NextFunction) {
    try {
      const bookings = await mentorService.getBookings();
      res.json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (err) {
      next(err);
    }
  }
};
