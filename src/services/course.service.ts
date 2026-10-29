import mongoose from "mongoose";
import { Course, CourseFilterQuery, CreateCourseInput, UpdateCourseInput } from "../types/course.js";
import { CourseModel } from "../models/Course.model.js";
import { COURSES } from "../data/seedData.js";

let inMemoryCourses: Course[] = [...COURSES];
let cachedDbCourses: Course[] | null = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export const courseService = {
  async getAll(filters: CourseFilterQuery = {}): Promise<Course[]> {
    const isUnfiltered =
      (!filters.category || filters.category === "all") &&
      (!filters.level || filters.level === "all") &&
      filters.popular !== "true" &&
      (!filters.search || !filters.search.trim()) &&
      !filters.sort;

    if (isUnfiltered && cachedDbCourses && Date.now() < cacheExpiry) {
      return cachedDbCourses;
    }

    if (isDbConnected()) {
      const query: any = {};
      if (filters.category && filters.category !== "all") {
        query.category = { $regex: new RegExp(`^${filters.category}$`, "i") };
      }
      if (filters.level && filters.level !== "all") {
        query.level = { $regex: new RegExp(filters.level, "i") };
      }
      if (filters.popular === "true") {
        query.$or = [{ isMostPopular: true }, { isBestseller: true }];
      }
      if (filters.search && filters.search.trim()) {
        const regex = { $regex: new RegExp(filters.search.trim(), "i") };
        query.$or = [
          { title: regex },
          { shortDesc: regex },
          { fullDesc: regex },
          { instructor: regex },
          { tools: regex },
          { category: regex }
        ];
      }

      let sortOption: any = {};
      if (filters.sort === "rating") {
        sortOption = { rating: -1 };
      } else if (filters.sort === "popular") {
        sortOption = { reviewsCount: -1 };
      }

      const docs = await CourseModel.find(query).sort(sortOption).lean();
      if (docs.length > 0) {
        const result = docs as unknown as Course[];
        if (isUnfiltered) {
          cachedDbCourses = result;
          cacheExpiry = Date.now() + CACHE_TTL_MS;
        }
        return result;
      }
    }

    // Fallback in-memory
    let result = [...inMemoryCourses];
    if (filters.category && filters.category !== "all") {
      result = result.filter(
        (c) => c.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }
    if (filters.level && filters.level !== "all") {
      result = result.filter(
        (c) => c.level.toLowerCase().includes(filters.level!.toLowerCase())
      );
    }
    if (filters.popular === "true") {
      result = result.filter((c) => c.isMostPopular || c.isBestseller);
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter((c) => {
        const inTitle = c.title.toLowerCase().includes(q);
        const inDesc = (c.shortDesc || "").toLowerCase().includes(q) || (c.fullDesc || "").toLowerCase().includes(q);
        const inInstructor = c.instructor.toLowerCase().includes(q);
        const inTools = (c.tools || []).some((t) => t.toLowerCase().includes(q));
        const inCategory = c.category.toLowerCase().includes(q);
        return inTitle || inDesc || inInstructor || inTools || inCategory;
      });
    }

    return result;
  },

  async getByIdOrSlug(identifier: string): Promise<Course | undefined> {
    if (isDbConnected()) {
      const doc = await CourseModel.findOne({
        $or: [
          { id: { $regex: new RegExp(`^${identifier}$`, "i") } },
          { slug: { $regex: new RegExp(`^${identifier}$`, "i") } }
        ]
      }).lean();
      if (doc) return doc as unknown as Course;
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
      category: data.category || "genai",
      level: data.level || "Beginner to Advanced",
      duration: data.duration || "12 Weeks",
      format: data.format || "Live Online & Offline",
      title: data.title,
      shortDesc: data.shortDesc,
      fullDesc: data.fullDesc || data.shortDesc,
      thumbnail:
        data.thumbnail ||
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
      rating: data.rating ?? 4.9,
      reviewsCount: data.reviewsCount ?? 0,
      instructor: data.instructor || "Innovacio Faculty",
      instructorRole: data.instructorRole || "Lead AI Scientist",
      price: data.price || "₹75,000",
      originalPrice: data.originalPrice || "₹95,000",
      discount: data.discount || "20% OFF",
      saveAmount: data.saveAmount || "Save ₹20,000",
      emi: data.emi || "EMI from ₹6,250/month",
      seatsLeft: data.seatsLeft ?? 10,
      enrolledCount: data.enrolledCount || "0 Enrolled",
      highlights: data.highlights || [
        "Live cohort training with industry mentors",
        "Dedicated cloud GPU lab access",
        "Dual accredited certificate"
      ],
      tools: data.tools || ["Python", "AI", "Cloud"],
      modules: data.modules || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      await CourseModel.create(newCourse);
    }
    cachedDbCourses = null;
    inMemoryCourses.push(newCourse);
    return newCourse;
  },

  async update(identifier: string, data: UpdateCourseInput): Promise<Course | undefined> {
    if (isDbConnected()) {
      const doc = await CourseModel.findOneAndUpdate(
        {
          $or: [
            { id: { $regex: new RegExp(`^${identifier}$`, "i") } },
            { slug: { $regex: new RegExp(`^${identifier}$`, "i") } }
          ]
        },
        { ...data, updatedAt: new Date().toISOString() },
        { returnDocument: "after" }
      ).lean();
      if (doc) {
        cachedDbCourses = null;
        return doc as unknown as Course;
      }
    }

    const course = inMemoryCourses.find(
      (c) =>
        c.id.toLowerCase() === identifier.toLowerCase() ||
        c.slug.toLowerCase() === identifier.toLowerCase()
    );
    if (!course) return undefined;
    Object.assign(course, data, { updatedAt: new Date().toISOString() });
    cachedDbCourses = null;
    return course;
  },

  async delete(identifier: string): Promise<boolean> {
    if (isDbConnected()) {
      const res = await CourseModel.deleteOne({
        $or: [
          { id: { $regex: new RegExp(`^${identifier}$`, "i") } },
          { slug: { $regex: new RegExp(`^${identifier}$`, "i") } }
        ]
      });
      if (res.deletedCount > 0) {
        cachedDbCourses = null;
        return true;
      }
      return false;
    }

    const index = inMemoryCourses.findIndex(
      (c) =>
        c.id.toLowerCase() === identifier.toLowerCase() ||
        c.slug.toLowerCase() === identifier.toLowerCase()
    );
    if (index === -1) return false;
    inMemoryCourses.splice(index, 1);
    cachedDbCourses = null;
    return true;
  },

  async getCategories() {
    if (isDbConnected()) {
      const result = await CourseModel.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $project: { category: "$_id", count: 1, _id: 0 } }
      ]);
      if (result.length > 0) return result;
    }

    const map: Record<string, number> = {};
    for (const c of inMemoryCourses) {
      map[c.category] = (map[c.category] || 0) + 1;
    }
    return Object.entries(map).map(([category, count]) => ({ category, count }));
  }
};