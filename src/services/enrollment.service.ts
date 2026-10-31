import mongoose from "mongoose";
import { Enrollment, CheckoutInput, Coupon } from "../types/enrollment.js";
import { EnrollmentModel } from "../models/Enrollment.model.js";
import { CourseModel } from "../models/Course.model.js";
import { StudentUserModel } from "../models/Student.model.js";

const VALID_COUPONS: Record<string, Coupon> = {
  INNOAI2026: {
    code: "INNOAI2026",
    discountAmount: 2000,
    description: "Innovacio 2026 Special Voucher - ₹2,000 Flat Off",
    active: true
  },
  EARLYBIRD: {
    code: "EARLYBIRD",
    discountAmount: 2000,
    description: "Early Bird Admission Discount - ₹2,000 Off",
    active: true
  }
};

let inMemoryEnrollments: Enrollment[] = [];

function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export const enrollmentService = {
  verifyCoupon(code: string, basePrice: number = 75000) {
    const cleanCode = code.trim().toUpperCase();
    const coupon = VALID_COUPONS[cleanCode];

    if (!coupon || !coupon.active) {
      return {
        valid: false,
        message: "Invalid coupon code. Try INNOAI2026 or EARLYBIRD",
        discountAmount: 0,
        finalPrice: basePrice
      };
    }

    const discountAmount = coupon.discountAmount;
    const finalPrice = Math.max(0, basePrice - discountAmount);

    return {
      valid: true,
      message: `Promo code ${coupon.code} applied: ₹${discountAmount.toLocaleString()} Off!`,
      discountAmount,
      finalPrice
    };
  },

  async createCheckout(data: CheckoutInput): Promise<Enrollment> {
    const normalizedEmail = data.email.trim().toLowerCase();

    // 1. Fetch real course from DB to prevent client price tampering
    let courseTitle = "Innovacio AI Cohort";
    let numericBasePrice = 75000;
    let courseSlug = data.courseId;
    let courseThumb = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80";

    if (isDbConnected()) {
      const courseDoc = await CourseModel.findOne({
        $or: [{ id: data.courseId }, { slug: data.courseId }]
      }).lean();

      if (courseDoc) {
        courseTitle = courseDoc.title;
        courseSlug = courseDoc.slug;
        courseThumb = (courseDoc as any).thumbnail || courseThumb;
        numericBasePrice = (courseDoc as any).price ? (parseInt(String((courseDoc as any).price).replace(/[^0-9]/g, ""), 10) || 75000) : 75000;
      }
    }

    // 2. Prevent duplicate active enrollment
    if (isDbConnected()) {
      const existing = await EnrollmentModel.findOne({
        email: normalizedEmail,
        courseId: data.courseId,
        status: { $in: ["confirmed", "pending_payment"] }
      }).lean();

      if (existing) {
        return existing as unknown as Enrollment;
      }
    }

    // 3. Server-side discount calculation
    let discountApplied = 0;
    if (data.couponCode) {
      const couponCheck = this.verifyCoupon(data.couponCode, numericBasePrice);
      if (couponCheck.valid) {
        discountApplied = couponCheck.discountAmount;
      }
    }

    // Calculate final payable price
    let finalPayable = Math.max(0, numericBasePrice - discountApplied);
    if (data.paymentOption === "deposit") {
      finalPayable = 5000; // Seat reservation token
    }

    const enrollmentId = `INNO-ENR-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const enrollment: Enrollment = {
      id: enrollmentId,
      courseId: data.courseId,
      courseTitle,
      name: data.name.trim(),
      email: normalizedEmail,
      phone: data.phone.trim(),
      mode: data.mode || "hybrid",
      experience: data.experience || "working_professional",
      paymentOption: data.paymentOption || "full",
      couponCode: discountApplied > 0 ? data.couponCode?.toUpperCase() : undefined,
      discountApplied,
      finalPrice: finalPayable,
      currency: "INR",
      paymentStatus: "pending", // Payment awaiting gateway or admissions reconciliation
      status: "pending_payment",
      createdAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      await EnrollmentModel.create(enrollment);

      // Link to student account if student is registered
      const student = await StudentUserModel.findOne({ email: normalizedEmail });
      if (student) {
        const alreadyHasCourse = student.enrolledCourses?.some((c) => c.id === data.courseId);
        if (!alreadyHasCourse) {
          student.enrolledCourses = student.enrolledCourses || [];
          student.enrolledCourses.push({
            id: data.courseId,
            title: courseTitle,
            slug: courseSlug,
            thumbnail: courseThumb,
            week: "Week 1 of 12",
            progress: 0,
            completedLessons: [],
            status: "in-progress",
            nextClass: "Saturday 10:00 AM IST"
          });
          await student.save();
        }
      }
    } else {
      inMemoryEnrollments.push(enrollment);
    }

    return enrollment;
  },

  async getEnrollments(email?: string): Promise<Enrollment[]> {
    if (isDbConnected()) {
      const query = email ? { email: email.trim().toLowerCase() } : {};
      const docs = await EnrollmentModel.find(query).sort({ createdAt: -1 }).lean();
      return docs as unknown as Enrollment[];
    }
    return email
      ? inMemoryEnrollments.filter((e) => e.email.toLowerCase() === email.toLowerCase())
      : inMemoryEnrollments;
  }
};
