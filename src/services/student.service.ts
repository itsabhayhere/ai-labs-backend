import { emailService } from "./email.service.js";
import crypto from "crypto";
import { OtpVerificationModel } from "../models/OtpVerification.model.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { StudentDashboardData, StudentUser } from "../types/student.js";
import { StudentUserModel } from "../models/Student.model.js";
import { INITIAL_STUDENT_DASHBOARD } from "../data/studentData.js";
import { config } from "../config/index.js";

let inMemoryDashboardData: StudentDashboardData = JSON.parse(
  JSON.stringify(INITIAL_STUDENT_DASHBOARD)
);

// In-memory user store with hashed passwords for offline/fallback mode
export let inMemoryUsers: Array<StudentUser & { password?: string }> = [
  {
    ...INITIAL_STUDENT_DASHBOARD.user,
    // Pre-hashed "Student@2026"
    password: bcrypt.hashSync("Student@2026", 10)
  },
  {
    id: "admin_001",
    name: "Admin User",
    email: "admin@innovacio.ai",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    role: "admin",
    batch: "Staff",
    campus: "Park Street Campus, Kolkata",
    createdAt: "2026-10-01T00:00:00.000Z",
    password: bcrypt.hashSync("Admin@2026", 10),
    enrolledCourses: []
  }
];


interface PendingOtpData {
  otp: string;
  name: string;
  password?: string;
  phone?: string;
  preferredTrack?: string;
  expiresAt: Date;
  attempts: number;
}
const inMemoryPendingOtps = new Map<string, PendingOtpData>();

function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export const studentService = {
  async getDashboard(userId?: string): Promise<StudentDashboardData> {
    if (isDbConnected() && userId) {
      const userDoc = await StudentUserModel.findOne({
        $or: [{ id: userId }, { email: userId.toLowerCase() }]
      }).lean();

      if (userDoc) {
        const enrolled = userDoc.enrolledCourses || [];

        const { password: _, ...safeUser } = userDoc as any;
        return {
          ...inMemoryDashboardData,
          user: safeUser as StudentUser,
          enrolledCourses: enrolled as any,
          stats: {
            ...inMemoryDashboardData.stats,
            coursesEnrolled: enrolled.length
          }
        };
      }
    }

    if (isDbConnected()) {
      const firstUser = await StudentUserModel.findOne().lean();
      if (firstUser) {
        const { password: _, ...safeUser } = firstUser as any;
        const enrolled = firstUser.enrolledCourses || [];

        return {
          ...inMemoryDashboardData,
          user: safeUser as StudentUser,
          enrolledCourses: enrolled as any,
          stats: {
            ...inMemoryDashboardData.stats,
            coursesEnrolled: enrolled.length
          }
        };
      }
    }

    return inMemoryDashboardData;
  },

  async login(email: string, password?: string): Promise<{ token: string; user: Omit<StudentUser, "password"> }> {
    const normalizedEmail = email.trim().toLowerCase();

    if (isDbConnected()) {
      const userDoc = await StudentUserModel.findOne({ email: normalizedEmail })
        .select("+password")
        .lean();

      if (!userDoc) {
        const err: any = new Error("Invalid email or password.");
        err.statusCode = 401;
        err.code = "INVALID_CREDENTIALS";
        throw err;
      }

      if (userDoc.password && password) {
        const matches = await bcrypt.compare(password, userDoc.password);
        if (!matches) {
          const err: any = new Error("Invalid email or password.");
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

    // In-memory fallback
    const user = inMemoryUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      const err: any = new Error("Invalid email or password.");
      err.statusCode = 401;
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }

    if (user.password && password) {
      const matches = await bcrypt.compare(password, user.password);
      if (!matches) {
        const err: any = new Error("Invalid email or password.");
        err.statusCode = 401;
        err.code = "INVALID_CREDENTIALS";
        throw err;
      }
    }

    const { password: _, ...safeUser } = user;
    const token = jwt.sign(
      {
        id: safeUser.id,
        email: safeUser.email,
        role: safeUser.role,
        name: safeUser.name
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );

    return { token, user: safeUser as StudentUser };
  },

  async register(
    name: string,
    email: string,
    password?: string
  ): Promise<{ token: string; user: Omit<StudentUser, "password"> }> {
    const normalizedEmail = email.trim().toLowerCase();

    if (isDbConnected()) {
      const existing = await StudentUserModel.findOne({ email: normalizedEmail }).lean();
      if (existing) {
        const err: any = new Error("An account with this email address already exists.");
        err.statusCode = 409;
        err.code = "ACCOUNT_EXISTS";
        throw err;
      }

      const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
      const newStudentId = `std_${Date.now()}`;

      const created = await StudentUserModel.create({
        id: newStudentId,
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        role: "student",
        batch: "Nov 2026 Cohort",
        campus: "Park Street Campus, Kolkata",
        enrolledCourses: []
      });

      const userObj = created.toObject();
      const { password: _, ...safeUser } = userObj as any;

      const token = jwt.sign(
        {
          id: safeUser.id,
          email: safeUser.email,
          role: safeUser.role,
          name: safeUser.name
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn as any }
      );

      return {
        token,
        user: safeUser as StudentUser
      };
    }

    // In-memory fallback
    const existing = inMemoryUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      const err: any = new Error("An account with this email address already exists.");
      err.statusCode = 409;
      err.code = "ACCOUNT_EXISTS";
      throw err;
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const newStudentId = `std_${Date.now()}`;
    const newUser: StudentUser & { password?: string } = {
      id: newStudentId,
      name,
      email: normalizedEmail,
      password: hashedPassword,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      role: "student",
      batch: "Nov 2026 Cohort",
      campus: "Park Street Campus, Kolkata",
      createdAt: new Date().toISOString()
    };
    inMemoryUsers.push(newUser);
    inMemoryDashboardData.user = newUser;

    const { password: _, ...safeUser } = newUser;
    const token = jwt.sign(
      {
        id: safeUser.id,
        email: safeUser.email,
        role: safeUser.role,
        name: safeUser.name
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );

    return { token, user: safeUser };
  },

  async updateCourseProgress(
    userId: string | undefined,
    courseId: string,
    progress: number,
    lessonId?: string
  ) {
    const clampedProgress = Math.min(100, Math.max(0, progress));
    const status = clampedProgress === 100 ? "completed" : "in-progress";

    if (isDbConnected() && userId) {
      const user = await StudentUserModel.findOne({
        $or: [{ id: userId }, { email: userId.toLowerCase() }]
      });

      if (user) {
        const existingIdx = user.enrolledCourses?.findIndex((c) => c.id === courseId);
        if (existingIdx !== undefined && existingIdx >= 0 && user.enrolledCourses) {
          user.enrolledCourses[existingIdx].progress = clampedProgress;
          user.enrolledCourses[existingIdx].status = status;
          if (lessonId && !user.enrolledCourses[existingIdx].completedLessons?.includes(lessonId)) {
            user.enrolledCourses[existingIdx].completedLessons = [
              ...(user.enrolledCourses[existingIdx].completedLessons || []),
              lessonId
            ];
          }
        } else {
          user.enrolledCourses = user.enrolledCourses || [];
          user.enrolledCourses.push({
            id: courseId,
            title: courseId.replace(/[-_]/g, " ").toUpperCase(),
            slug: courseId,
            thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
            week: "Week 1 of 12",
            progress: clampedProgress,
            completedLessons: lessonId ? [lessonId] : [],
            status,
            nextClass: "Live Hybrid Session"
          });
        }
        await user.save();
        return user.enrolledCourses.find((c) => c.id === courseId);
      }
    }

    // In-memory update
    let course = inMemoryDashboardData.enrolledCourses.find((c) => c.id === courseId);
    if (course) {
      course.progress = clampedProgress;
      course.status = status;
    } else {
      course = {
        id: courseId,
        title: courseId.replace(/[-_]/g, " ").toUpperCase(),
        slug: courseId,
        thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
        week: "Week 1 of 12",
        progress: clampedProgress,
        status,
        nextClass: "Live Hybrid Session"
      };
      inMemoryDashboardData.enrolledCourses.push(course);
    }
    return course;
  },

  async sendRegistrationOtp(
    name: string,
    email: string,
    password: string,
    phone?: string,
    preferredTrack?: string
  ): Promise<{ email: string; expiresAt: string; devOtp?: string; message: string }> {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check if account already exists
    if (isDbConnected()) {
      const existing = await StudentUserModel.findOne({ email: normalizedEmail }).lean();
      if (existing) {
        const err: any = new Error("An account with this email address already exists.");
        err.statusCode = 409;
        err.code = "ACCOUNT_EXISTS";
        throw err;
      }
    } else {
      const existing = inMemoryUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (existing) {
        const err: any = new Error("An account with this email address already exists.");
        err.statusCode = 409;
        err.code = "ACCOUNT_EXISTS";
        throw err;
      }
    }

    // 2. Generate secure 6-digit numeric OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 3. Persist pending verification
    if (isDbConnected()) {
      await OtpVerificationModel.findOneAndUpdate(
        { email: normalizedEmail },
        {
          email: normalizedEmail,
          otp,
          name: name.trim(),
          password: hashedPassword,
          phone: phone?.trim(),
          preferredTrack: preferredTrack?.trim(),
          expiresAt,
          attempts: 0
        },
        { upsert: true, new: true }
      );
    }

    // Always keep in-memory backup
    inMemoryPendingOtps.set(normalizedEmail, {
      otp,
      name: name.trim(),
      password: hashedPassword,
      phone: phone?.trim(),
      preferredTrack: preferredTrack?.trim(),
      expiresAt,
      attempts: 0
    });

    // Dispatch branded email via Resend
    await emailService.sendOtpEmail(normalizedEmail, name.trim(), otp);


    console.log("\n=======================================================");
    console.log("🔐 [INNOVACIO AI LABS - OTP DISPATCH]");
    console.log(`📧 Target Recipient : ${normalizedEmail}`);
    console.log(`🔑 Verification Code : ${otp}`);
    console.log(`⏳ Code Expires At   : ${expiresAt.toLocaleTimeString()}`);
    console.log("=======================================================\n");

    return {
      email: normalizedEmail,
      expiresAt: expiresAt.toISOString(),
      devOtp: config.isProduction ? undefined : otp,
      message: `A 6-digit verification code has been dispatched to ${normalizedEmail}.`
    };
  },

  async verifyRegistrationOtp(
    email: string,
    otp: string
  ): Promise<{ token: string; user: Omit<StudentUser, "password">; message: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    let pending: PendingOtpData | null = null;

    if (isDbConnected()) {
      const doc = await OtpVerificationModel.findOne({ email: normalizedEmail });
      if (doc) {
        pending = {
          otp: doc.otp,
          name: doc.name,
          password: doc.password,
          phone: doc.phone,
          preferredTrack: doc.preferredTrack,
          expiresAt: doc.expiresAt,
          attempts: doc.attempts || 0
        };
      }
    }

    if (!pending) {
      pending = inMemoryPendingOtps.get(normalizedEmail) || null;
    }

    if (!pending) {
      const err: any = new Error("No pending verification found for this email, or code has expired. Please request a new code.");
      err.statusCode = 400;
      err.code = "OTP_NOT_FOUND";
      throw err;
    }

    if (new Date() > new Date(pending.expiresAt)) {
      if (isDbConnected()) {
        await OtpVerificationModel.deleteOne({ email: normalizedEmail });
      }
      inMemoryPendingOtps.delete(normalizedEmail);

      const err: any = new Error("Verification code has expired. Please request a new code.");
      err.statusCode = 400;
      err.code = "OTP_EXPIRED";
      throw err;
    }

    if (pending.otp !== cleanOtp) {
      const newAttempts = pending.attempts + 1;
      if (newAttempts >= 5) {
        if (isDbConnected()) {
          await OtpVerificationModel.deleteOne({ email: normalizedEmail });
        }
        inMemoryPendingOtps.delete(normalizedEmail);

        const err: any = new Error("Too many incorrect attempts. For security, please request a new verification code.");
        err.statusCode = 429;
        err.code = "OTP_MAX_ATTEMPTS";
        throw err;
      }

      if (isDbConnected()) {
        await OtpVerificationModel.updateOne({ email: normalizedEmail }, { $inc: { attempts: 1 } });
      }
      pending.attempts = newAttempts;
      inMemoryPendingOtps.set(normalizedEmail, pending);

      const err: any = new Error(`Invalid verification code. Please check your 6-digit code (${5 - newAttempts} attempts remaining).`);
      err.statusCode = 400;
      err.code = "INVALID_OTP";
      throw err;
    }

    // OTP Verified! Create user
    const newStudentId = `std_${Date.now()}`;
    let createdUser: any;

    if (isDbConnected()) {
      const created = await StudentUserModel.create({
        id: newStudentId,
        name: pending.name,
        email: normalizedEmail,
        password: pending.password,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        role: "student",
        batch: "Nov 2026 Cohort",
        campus: "Park Street Campus, Kolkata",
        enrolledCourses: []
      });

      await OtpVerificationModel.deleteOne({ email: normalizedEmail });
      inMemoryPendingOtps.delete(normalizedEmail);

      const userObj = created.toObject();
      const { password: _, ...safeUser } = userObj as any;
      createdUser = safeUser;
    } else {
      const newUser: StudentUser & { password?: string } = {
        id: newStudentId,
        name: pending.name,
        email: normalizedEmail,
        password: pending.password,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        role: "student",
        batch: "Nov 2026 Cohort",
        campus: "Park Street Campus, Kolkata",
        createdAt: new Date().toISOString()
      };
      inMemoryUsers.push(newUser);
      inMemoryDashboardData.user = newUser;
      inMemoryPendingOtps.delete(normalizedEmail);

      const { password: _, ...safeUser } = newUser;
      createdUser = safeUser;
    }

    const token = jwt.sign(
      {
        id: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
        name: createdUser.name
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );

    return {
      token,
      user: createdUser,
      message: `Account successfully verified and activated for ${createdUser.name}.`
    };
  },

  async resendRegistrationOtp(
    email: string
  ): Promise<{ email: string; expiresAt: string; devOtp?: string; message: string }> {
    const normalizedEmail = email.trim().toLowerCase();

    let pending: PendingOtpData | null = null;
    if (isDbConnected()) {
      const doc = await OtpVerificationModel.findOne({ email: normalizedEmail });
      if (doc) {
        pending = {
          otp: doc.otp,
          name: doc.name,
          password: doc.password,
          phone: doc.phone,
          preferredTrack: doc.preferredTrack,
          expiresAt: doc.expiresAt,
          attempts: doc.attempts || 0
        };
      }
    }

    if (!pending) {
      pending = inMemoryPendingOtps.get(normalizedEmail) || null;
    }

    if (!pending) {
      const err: any = new Error("No pending registration found for this email. Please fill the registration form first.");
      err.statusCode = 404;
      err.code = "PENDING_REGISTRATION_NOT_FOUND";
      throw err;
    }

    const newOtp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (isDbConnected()) {
      await OtpVerificationModel.updateOne(
        { email: normalizedEmail },
        {
          otp: newOtp,
          expiresAt,
          attempts: 0
        }
      );
    }

    inMemoryPendingOtps.set(normalizedEmail, {
      ...pending,
      otp: newOtp,
      expiresAt,
      attempts: 0
    });

    // Dispatch fresh email via Resend
    await emailService.sendOtpEmail(normalizedEmail, pending.name, newOtp);

    console.log("\n=======================================================");
    console.log("🔄 [INNOVACIO AI LABS - OTP RESEND]");
    console.log(`📧 Target Recipient : ${normalizedEmail}`);
    console.log(`🔑 New Verification Code: ${newOtp}`);
    console.log(`⏳ Code Expires At   : ${expiresAt.toLocaleTimeString()}`);
    console.log("=======================================================\n");

    return {
      email: normalizedEmail,
      expiresAt: expiresAt.toISOString(),
      devOtp: config.isProduction ? undefined : newOtp,
      message: `A fresh 6-digit verification code has been dispatched to ${normalizedEmail}.`
    };
  }
};
