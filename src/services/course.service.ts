import mongoose from "mongoose";
import { Course, CourseFilterQuery, CreateCourseInput, UpdateCourseInput } from "../types/course.js";
import { CourseModel } from "../models/Course.model.js";
import { COURSES } from "../data/seedData.js";

let inMemoryCourses: Course[] = [...COURSES];

function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export const courseService = {
  async getAll(filters: CourseFilterQuery = {}): Promise<Course[]> {
    if (isDbConnected()) {
      const query: any = {};
      if (filters.search && filters.search.trim()) {
        const regex = { $regex: new RegExp(filters.search.trim(), "i") };
        query.$or = [
          { title: regex },
          { positioning: regex },
          { audience: regex },
          { coreStack: regex }
        ];
      }

      let sortOption: any = {};
      if (filters.sort === "title-asc") {
        sortOption = { title: 1 };
      } else if (filters.sort === "title-desc") {
        sortOption = { title: -1 };
      } else if (filters.sort === "newest") {
        sortOption = { createdAt: -1 };
      } else if (filters.sort === "oldest") {
        sortOption = { createdAt: 1 };
      }

      const docs = await CourseModel.find(query).sort(sortOption).lean();
      return docs as unknown as Course[];
    }

    // Fallback only if database is completely disconnected
    let result = [...inMemoryCourses];
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter((c) => {
        const inTitle = (c.title || "").toLowerCase().includes(q);
        const inPositioning = (c.positioning || "").toLowerCase().includes(q);
        const inAudience = (c.audience || "").toLowerCase().includes(q);
        const inCoreStack = (c.coreStack || []).some((t) => t.toLowerCase().includes(q));
        return inTitle || inPositioning || inAudience || inCoreStack;
      });
    }

    if (filters.sort === "title-asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (filters.sort === "title-desc") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
  },

  async getByIdOrSlug(identifier: string): Promise<Course | undefined> {
    if (isDbConnected()) {
      const orConditions: any[] = [
        { id: { $regex: new RegExp(`^${identifier}$`, "i") } },
        { slug: { $regex: new RegExp(`^${identifier}$`, "i") } }
      ];
      if (mongoose.isValidObjectId(identifier)) {
        orConditions.push({ _id: identifier });
      }
      const doc = await CourseModel.findOne({ $or: orConditions }).lean();
      return doc ? (doc as unknown as Course) : undefined;
    }

    return inMemoryCourses.find(
      (c) =>
        c.id.toLowerCase() === identifier.toLowerCase() ||
        c.slug.toLowerCase() === identifier.toLowerCase()
    );
  },

  async create(data: CreateCourseInput): Promise<Course> {
    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const newCourse: Course = {
      id: data.id || slug,
      slug,
      title: data.title,
      positioning: data.positioning,
      audience: data.audience,
      duration: data.duration,
      coreStack: data.coreStack,
      curriculum: data.curriculum,
      projectCheckpoints: data.projectCheckpoints,
      careerSupportBundle: data.careerSupportBundle,
      successMetrics: data.successMetrics,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      await CourseModel.create(newCourse);
      return newCourse;
    }
    inMemoryCourses.push(newCourse);
    return newCourse;
  },

  async update(identifier: string, data: UpdateCourseInput): Promise<Course | undefined> {
    if (isDbConnected()) {
      const orConditions: any[] = [
        { id: { $regex: new RegExp(`^${identifier}$`, "i") } },
        { slug: { $regex: new RegExp(`^${identifier}$`, "i") } }
      ];
      if (mongoose.isValidObjectId(identifier)) {
        orConditions.push({ _id: identifier });
      }
      const doc = await CourseModel.findOneAndUpdate(
        { $or: orConditions },
        { ...data, updatedAt: new Date().toISOString() },
        { returnDocument: "after" }
      ).lean();
      return doc ? (doc as unknown as Course) : undefined;
    }

    const course = inMemoryCourses.find(
      (c) =>
        c.id.toLowerCase() === identifier.toLowerCase() ||
        c.slug.toLowerCase() === identifier.toLowerCase()
    );
    if (!course) return undefined;
    Object.assign(course, data, { updatedAt: new Date().toISOString() });
    return course;
  },

  async delete(identifier: string): Promise<boolean> {
    if (isDbConnected()) {
      const orConditions: any[] = [
        { id: { $regex: new RegExp(`^${identifier}$`, "i") } },
        { slug: { $regex: new RegExp(`^${identifier}$`, "i") } }
      ];
      if (mongoose.isValidObjectId(identifier)) {
        orConditions.push({ _id: identifier });
      }
      const res = await CourseModel.deleteOne({ $or: orConditions });
      return res.deletedCount > 0;
    }

    const index = inMemoryCourses.findIndex(
      (c) =>
        c.id.toLowerCase() === identifier.toLowerCase() ||
        c.slug.toLowerCase() === identifier.toLowerCase()
    );
    if (index === -1) return false;
    inMemoryCourses.splice(index, 1);
    return true;
  },

  async getCategories() {
    if (isDbConnected()) {
      const counts = await CourseModel.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]);
      return counts.map((c) => ({ category: c._id || "all", count: c.count }));
    }
    return [];
  }
};
