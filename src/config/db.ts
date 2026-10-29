import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "./index.js";
import { CourseModel } from "../models/Course.model.js";
import { MentorModel } from "../models/Mentor.model.js";
import { FaqModel, TestimonialModel } from "../models/Content.model.js";
import { DiscussionModel } from "../models/Discussion.model.js";
import { StudentUserModel } from "../models/Student.model.js";
import { COURSES, MENTORS, FAQS, TESTIMONIALS } from "../data/seedData.js";
import { INITIAL_DISCUSSIONS } from "../data/discussionsData.js";
import { INITIAL_STUDENT_DASHBOARD } from "../data/studentData.js";

export async function connectDB(): Promise<typeof mongoose | null> {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`🌿 MongoDB Connected to: ${conn.connection.name}`);

    // Gated idempotent seeding: only runs when explicitly configured
    if (config.seedDemoData) {
      await seedDatabaseIdempotent();
    } else {
      console.log("ℹ️  Database seeding skipped (SEED_DEMO_DATA is disabled).");
    }

    return conn;
  } catch (error: any) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    return null;
  }
}

export async function seedDatabaseIdempotent() {
  try {
    // 1. Courses - Seed only missing items by slug/id
    for (const course of COURSES) {
      const exists = await CourseModel.findOne({ id: course.id }).lean();
      if (!exists) {
        await CourseModel.create(course);
      }
    }

    // 2. Mentors - Seed only missing items by id
    for (const mentor of MENTORS) {
      const exists = await MentorModel.findOne({ id: mentor.id }).lean();
      if (!exists) {
        await MentorModel.create(mentor);
      }
    }

    // 3. FAQs - Seed only missing items by question
    for (const faq of FAQS) {
      const exists = await FaqModel.findOne({ question: faq.question }).lean();
      if (!exists) {
        await FaqModel.create(faq);
      }
    }

    // 4. Testimonials - Seed only missing items by name
    for (const testimonial of TESTIMONIALS) {
      const exists = await TestimonialModel.findOne({ name: testimonial.name }).lean();
      if (!exists) {
        await TestimonialModel.create(testimonial);
      }
    }

    // 5. Discussions - Seed only missing items by id
    for (const disc of INITIAL_DISCUSSIONS) {
      const exists = await DiscussionModel.findOne({ id: disc.id }).lean();
      if (!exists) {
        await DiscussionModel.create(disc);
      }
    }

    // 6. Default Student User (for local dev testing only)
    const existingUser = await StudentUserModel.findOne({
      email: INITIAL_STUDENT_DASHBOARD.user.email
    }).lean();

    if (!existingUser && !config.isProduction) {
      // Hash password securely with bcrypt salt rounds = 10
      const hashedPassword = await bcrypt.hash("Student@2026", 10);
      await StudentUserModel.create({
        ...INITIAL_STUDENT_DASHBOARD.user,
        password: hashedPassword,
        enrolledCourses: INITIAL_STUDENT_DASHBOARD.enrolledCourses
      });
      console.log("✓ Seeded default student account for local development");
    }
  } catch (err: any) {
    console.warn("Seeding notice:", err.message);
  }
}
