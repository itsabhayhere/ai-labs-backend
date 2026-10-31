import { Request, Response, NextFunction } from "express";
import { adminService } from "../services/admin.service.js";
import { setAuthCookies, clearAuthCookies } from "../utils/cookie.js";

export const adminController = {
  // ─── ADMIN AUTHENTICATION ───────────────────────────────────────────
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await adminService.login(email, password);
      setAuthCookies(res, result.token, "admin");
      res.status(200).json({
        success: true,
        message: "Administrator logged in successfully",
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  async logout(_req: Request, res: Response, next: NextFunction) {
    try {
      clearAuthCookies(res);
      res.status(200).json({
        success: true,
        message: "Administrator session cleared successfully"
      });
    } catch (err) {
      next(err);
    }
  },

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required"
          }
        });
      }

      const admin = await adminService.getMe(req.user.id);
      if (!admin) {
        return res.status(404).json({
          success: false,
          error: {
            code: "ADMIN_NOT_FOUND",
            message: "Administrator profile not found"
          }
        });
      }

      res.json({
        success: true,
        data: admin
      });
    } catch (err) {
      next(err);
    }
  },

  // ─── DASHBOARD STATS ────────────────────────────────────────────────
  async getDashboardStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await adminService.getDashboardStats();
      res.json({
        success: true,
        message: "Admin statistics retrieved successfully",
        data: stats
      });
    } catch (err) {
      next(err);
    }
  },

  // ─── STUDENT ACTIONS ────────────────────────────────────────────────
  async getStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, batch, campus, role, courseId, sort } = req.query as any;
      const result = await adminService.getStudents({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search,
        batch,
        campus,
        role,
        courseId,
        sort
      });

      res.json({
        success: true,
        message: "Students retrieved successfully",
        data: result.items,
        pagination: result.pagination
      });
    } catch (err) {
      next(err);
    }
  },

  async getStudentById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const student = await adminService.getStudentById(id);

      if (!student) {
        return res.status(404).json({
          success: false,
          error: {
            code: "STUDENT_NOT_FOUND",
            message: `Student with identifier '${id}' was not found`
          }
        });
      }

      res.json({
        success: true,
        data: student
      });
    } catch (err) {
      next(err);
    }
  },

  async updateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const updated = await adminService.updateStudent(id, req.body);

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: {
            code: "STUDENT_NOT_FOUND",
            message: `Student with identifier '${id}' was not found`
          }
        });
      }

      res.json({
        success: true,
        message: "Student record updated successfully",
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const deleted = await adminService.deleteStudent(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: {
            code: "STUDENT_NOT_FOUND",
            message: `Student with identifier '${id}' was not found`
          }
        });
      }

      res.json({
        success: true,
        message: "Student record removed successfully"
      });
    } catch (err) {
      next(err);
    }
  },

  // ─── COURSE ACTIONS (CRUD) ──────────────────────────────────────────
  async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, sort } = req.query as any;
      const result = await adminService.getAllCourses({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search,
        sort
      });

      res.json({
        success: true,
        message: "Courses retrieved successfully",
        data: result.items,
        pagination: result.pagination
      });
    } catch (err) {
      next(err);
    }
  },

  async getCourseById(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = String(req.params.slugOrId || req.params.id);
      const course = await adminService.getCourseById(identifier);

      if (!course) {
        return res.status(404).json({
          success: false,
          error: {
            code: "COURSE_NOT_FOUND",
            message: `Course with identifier '${identifier}' was not found`
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

  async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await adminService.createCourse(req.body);
      res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: course
      });
    } catch (err) {
      next(err);
    }
  },

  async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = String(req.params.slugOrId || req.params.id);
      const updated = await adminService.updateCourse(identifier, req.body);

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: {
            code: "COURSE_NOT_FOUND",
            message: `Course with identifier '${identifier}' was not found`
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

  async deleteCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = String(req.params.slugOrId || req.params.id);
      const deleted = await adminService.deleteCourse(identifier);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: {
            code: "COURSE_NOT_FOUND",
            message: `Course with identifier '${identifier}' was not found`
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

