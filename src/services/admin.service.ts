import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { StudentUserModel } from "../models/Student.model.js";
import { CourseModel } from "../models/Course.model.js";
import { MentorModel } from "../models/Mentor.model.js";
import { EnrollmentModel } from "../models/Enrollment.model.js";
import { StudentUser } from "../types/student.js";
import { Course, CreateCourseInput, UpdateCourseInput } from "../types/course.js";
import {
  AdminStudentFilterQuery,
  AdminCourseFilterQuery,
  AdminUpdateStudentInput,
  AdminDashboardStats,
  PaginatedResult
} from "../types/admin.js";
import { inMemoryUsers } from "./student.service.js";
import { courseService } from "./course.service.js";

function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export const adminService = {
  // ─── ADMIN AUTHENTICATION ───────────────────────────────────────────

  async login(
    email: string,
    password?: string
  ): Promise<{ token: string; user: Omit<StudentUser, "password"> }> {
    const normalizedEmail = email.trim().toLowerCase();

    if (isDbConnected()) {
      const userDoc = await StudentUserModel.findOne({ email: normalizedEmail })
        .select("+password")
        .lean();

      if (!userDoc) {
        const err: any = new Error("Invalid administrator email or password.");
        err.statusCode = 401;
        err.code = "INVALID_CREDENTIALS";
        throw err;
      }

      if (userDoc.role !== "admin") {
        const err: any = new Error(
          "Access denied. Only administrator accounts are permitted to log in here."
        );
        err.statusCode = 403;
        err.code = "ACCESS_DENIED";
        throw err;
      }

      if (userDoc.password && password) {
        const matches = await bcrypt.compare(password, userDoc.password);
        if (!matches) {
          const err: any = new Error("Invalid administrator email or password.");
          err.statusCode = 401;
          err.code = "INVALID_CREDENTIALS";
          throw err;
        }
      }

      const { password: _, ...safeUser } = userDoc as any;
      const token = jwt.sign(
        {
          id: userDoc.id,
          email: userDoc.email,
          role: userDoc.role,
          name: userDoc.name
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn as any }
      );

      return {
        token,
        user: safeUser as StudentUser
      };
    }

    // In-Memory Fallback
    const user = inMemoryUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      const err: any = new Error("Invalid administrator email or password.");
      err.statusCode = 401;
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }

    if (user.role !== "admin") {
      const err: any = new Error(
        "Access denied. Only administrator accounts are permitted to log in here."
      );
      err.statusCode = 403;
      err.code = "ACCESS_DENIED";
      throw err;
    }

    if (user.password && password) {
      const matches = await bcrypt.compare(password, user.password);
      if (!matches) {
        const err: any = new Error("Invalid administrator email or password.");
        err.statusCode = 401;
        err.code = "INVALID_CREDENTIALS";
        throw err;
      }
    }

    const { password: _, ...safeUser } = user;
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );

    return {
      token,
      user: safeUser
    };
  },

  async getMe(adminId: string): Promise<Omit<StudentUser, "password"> | null> {
    return this.getStudentById(adminId);
  },

  // ─── STUDENT MANAGEMENT ─────────────────────────────────────────────

  async getStudents(
    query: AdminStudentFilterQuery = {}
  ): Promise<PaginatedResult<Omit<StudentUser, "password">>> {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    if (isDbConnected()) {
      const filter: any = {};

      if (query.role) {
        filter.role = query.role;
      }
      if (query.batch) {
        filter.batch = { $regex: new RegExp(query.batch.trim(), "i") };
      }
      if (query.campus) {
        filter.campus = { $regex: new RegExp(query.campus.trim(), "i") };
      }
      if (query.courseId) {
        filter["enrolledCourses.id"] = query.courseId.trim();
      }
      if (query.search && query.search.trim()) {
        const regex = { $regex: new RegExp(query.search.trim(), "i") };
        filter.$or = [{ name: regex }, { email: regex }, { batch: regex }, { campus: regex }];
      }

      let sortOption: any = { createdAt: -1 };
      if (query.sort === "name-asc") sortOption = { name: 1 };
      else if (query.sort === "name-desc") sortOption = { name: -1 };
      else if (query.sort === "date-asc") sortOption = { createdAt: 1 };
      else if (query.sort === "date-desc") sortOption = { createdAt: -1 };

      const [docs, total] = await Promise.all([
        StudentUserModel.find(filter).select("-password").sort(sortOption).skip(skip).limit(limit).lean(),
        StudentUserModel.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limit) || 1;

      return {
        items: docs as unknown as Omit<StudentUser, "password">[],
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      };
    }

    // In-Memory Fallback
    let filtered = inMemoryUsers.map(({ password: _, ...rest }) => rest);

    if (query.role) {
      filtered = filtered.filter((u) => u.role === query.role);
    }
    if (query.batch) {
      const b = query.batch.toLowerCase();
      filtered = filtered.filter((u) => (u.batch || "").toLowerCase().includes(b));
    }
    if (query.campus) {
      const c = query.campus.toLowerCase();
      filtered = filtered.filter((u) => (u.campus || "").toLowerCase().includes(c));
    }
    if (query.courseId) {
      filtered = filtered.filter((u) =>
        (u.enrolledCourses || []).some((c) => c.id === query.courseId)
      );
    }
    if (query.search && query.search.trim()) {
      const s = query.search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s) ||
          (u.batch || "").toLowerCase().includes(s) ||
          (u.campus || "").toLowerCase().includes(s)
      );
    }

    if (query.sort === "name-asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (query.sort === "name-desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (query.sort === "date-asc") {
      filtered.sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
    } else {
      filtered.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    }

    const total = filtered.length;
    const items = filtered.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  },

  async getStudentById(id: string): Promise<Omit<StudentUser, "password"> | null> {
    if (isDbConnected()) {
      const doc = await StudentUserModel.findOne({
        $or: [{ id }, { email: id.toLowerCase() }]
      })
        .select("-password")
        .lean();
      return (doc as unknown as Omit<StudentUser, "password">) || null;
    }

    const user = inMemoryUsers.find(
      (u) => u.id === id || u.email.toLowerCase() === id.toLowerCase()
    );
    if (!user) return null;
    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  async updateStudent(
    id: string,
    data: AdminUpdateStudentInput
  ): Promise<Omit<StudentUser, "password"> | null> {
    if (isDbConnected()) {
      const doc = await StudentUserModel.findOneAndUpdate(
        { $or: [{ id }, { email: id.toLowerCase() }] },
        { $set: data },
        { new: true, select: "-password" }
      ).lean();
      return (doc as unknown as Omit<StudentUser, "password">) || null;
    }

    const user = inMemoryUsers.find(
      (u) => u.id === id || u.email.toLowerCase() === id.toLowerCase()
    );
    if (!user) return null;
    Object.assign(user, data);
    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  async deleteStudent(id: string): Promise<boolean> {
    if (isDbConnected()) {
      const res = await StudentUserModel.deleteOne({
        $or: [{ id }, { email: id.toLowerCase() }]
      });
      return (res.deletedCount || 0) > 0;
    }

    const index = inMemoryUsers.findIndex(
      (u) => u.id === id || u.email.toLowerCase() === id.toLowerCase()
    );
    if (index === -1) return false;
    inMemoryUsers.splice(index, 1);
    return true;
  },

  // ─── COURSE CRUD FOR ADMIN ──────────────────────────────────────────

  async getAllCourses(query: AdminCourseFilterQuery = {}): Promise<PaginatedResult<Course>> {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const allCourses = await courseService.getAll({
      search: query.search,
      sort: query.sort as any
    });

    const total = allCourses.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const items = allCourses.slice(skip, skip + limit);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  },

  async getCourseById(identifier: string): Promise<Course | null> {
    const course = await courseService.getByIdOrSlug(identifier);
    return course || null;
  },

  async createCourse(data: CreateCourseInput): Promise<Course> {
    return courseService.create(data);
  },

  async updateCourse(identifier: string, data: UpdateCourseInput): Promise<Course | null> {
    const updated = await courseService.update(identifier, data);
    return updated || null;
  },

  async deleteCourse(identifier: string): Promise<boolean> {
    return courseService.delete(identifier);
  },

  // ─── DASHBOARD STATS ────────────────────────────────────────────────

  async getDashboardStats(): Promise<AdminDashboardStats> {
    let studentsCount = 0;
    let coursesCount = 0;
    let mentorsCount = 0;
    let enrollmentsCount = 0;
    const studentsByRole: Record<string, number> = { student: 0, alumni: 0, admin: 0 };
    let recentStudents: Omit<StudentUser, "password">[] = [];

    if (isDbConnected()) {
      const [sCount, cCount, mCount, eCount, recentDocs, rolesAgg] = await Promise.all([
        StudentUserModel.countDocuments(),
        CourseModel.countDocuments(),
        MentorModel.countDocuments(),
        EnrollmentModel.countDocuments(),
        StudentUserModel.find().select("-password").sort({ createdAt: -1 }).limit(5).lean(),
        StudentUserModel.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }])
      ]);

      studentsCount = sCount;
      coursesCount = cCount;
      mentorsCount = mCount;
      enrollmentsCount = eCount;
      recentStudents = recentDocs as unknown as Omit<StudentUser, "password">[];

      for (const r of rolesAgg) {
        if (r._id) studentsByRole[r._id] = r.count;
      }
    } else {
      studentsCount = inMemoryUsers.length;
      coursesCount = (await courseService.getAll()).length;
      mentorsCount = 4;
      enrollmentsCount = 10;
      recentStudents = inMemoryUsers
        .slice(0, 5)
        .map(({ password: _, ...rest }) => rest);

      for (const u of inMemoryUsers) {
        studentsByRole[u.role] = (studentsByRole[u.role] || 0) + 1;
      }
    }

    return {
      studentsCount,
      coursesCount,
      mentorsCount,
      enrollmentsCount,
      coursesByCategory: {},
      studentsByRole,
      recentStudents
    };
  }
};

