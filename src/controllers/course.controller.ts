import { Request, Response, NextFunction } from "express";
import { courseService } from "../services/course.service.js";

export const courseController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, level, search, popular, sort } = req.query;
      const courses = await courseService.getAll({
        category: category ? String(category) : undefined,
        level: level ? String(level) : undefined,
        search: search ? String(search) : undefined,
        popular: popular ? String(popular) : undefined,
        sort: sort as any
      });

      res.json({
        success: true,
        message: "Courses retrieved successfully.",
        count: courses.length,
        data: courses
      });
    } catch (err) {
      next(err);
    }
  },

  async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await courseService.getCategories();
      res.json({
        success: true,
        data: categories
      });
    } catch (err) {
      next(err);
    }
  },

  async getByIdOrSlug(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = String(req.params.slugOrId || req.params.slug || req.params.id || "");
      const course = await courseService.getByIdOrSlug(identifier);

      if (!course) {
        return res.status(404).json({
          success: false,
          error: {
            code: "COURSE_NOT_FOUND",
            message: `Course not found for identifier '${identifier}'`
          }
        });
      }

      res.json({
        success: true,
        data: course
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newCourse = await courseService.create(req.body);
      res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: newCourse
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = String(req.params.slugOrId || req.params.slug || req.params.id || "");
      const updated = await courseService.update(identifier, req.body);

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: {
            code: "COURSE_NOT_FOUND",
            message: `Course not found for identifier '${identifier}'`
          }
        });
      }

      res.json({
        success: true,
        message: "Course updated successfully",
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = String(req.params.slugOrId || req.params.slug || req.params.id || "");
      const deleted = await courseService.delete(identifier);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: {
            code: "COURSE_NOT_FOUND",
            message: `Course not found for identifier '${identifier}'`
          }
        });
      }

      res.json({
        success: true,
        message: "Course deleted successfully"
      });
    } catch (err) {
      next(err);
    }
  }
};