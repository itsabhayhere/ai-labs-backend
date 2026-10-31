import { Router } from "express";
import courseRoute from "./course.route.js";
import mentorRoute from "./mentor.route.js";
import admissionsRoute from "./admissions.route.js";
import enrollmentRoute from "./enrollment.route.js";
import discussionRoute from "./discussion.route.js";
import contentRoute from "./content.route.js";
import studentRoute from "./student.route.js";
import authRoute from "./auth.route.js";
import adminRoute from "./admin.route.js";

const router = Router();

// Health check
router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    service: "Innovacio AI Labs Backend API",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root API Directory
router.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    name: "Innovacio AI Labs API",
    version: "2.0.0",
    description: "Production-grade REST API powering the Innovacio AI Labs platform",
    endpoints: {
      auth: {
        login: "POST /api/auth/login",
        register: "POST /api/auth/register",
        me: "GET /api/auth/me"
      },
      courses: {
        list: "GET /api/courses",
        categories: "GET /api/courses/categories",
        detailBySlug: "GET /api/courses/slug/:slug",
        detailByIdOrSlug: "GET /api/courses/:slugOrId"
      },
      mentors: {
        list: "GET /api/mentors",
        detail: "GET /api/mentors/:id",
        bookSession: "POST /api/mentors/bookings"
      },
      admissions: {
        scheduleCounseling: "POST /api/admissions/counseling",
        downloadBrochure: "POST /api/admissions/brochure",
        bookCampusVisit: "POST /api/admissions/campus-visit"
      },
      enrollments: {
        checkout: "POST /api/enrollments/checkout",
        verifyCoupon: "POST /api/enrollments/verify-coupon",
        list: "GET /api/enrollments"
      },
      discussions: {
        list: "GET /api/discussions",
        categories: "GET /api/discussions/categories",
        detail: "GET /api/discussions/:id",
        createTopic: "POST /api/discussions",
        upvote: "POST /api/discussions/:id/upvote",
        reply: "POST /api/discussions/:id/replies"
      },
      student: {
        dashboard: "GET /api/student/dashboard",
        profile: "GET /api/student/me",
        updateProgress: "POST /api/student/progress"
      },
      admin: {
        login: "POST /api/admin/login",
        me: "GET /api/admin/me",
        stats: "GET /api/admin/stats",
        studentsList: "GET /api/admin/students",
        studentDetail: "GET /api/admin/students/:id",
        studentUpdate: "PUT /api/admin/students/:id",
        studentDelete: "DELETE /api/admin/students/:id",
        courseList: "GET /api/admin/courses",
        courseDetail: "GET /api/admin/courses/:slugOrId",
        courseCreate: "POST /api/admin/courses",
        courseUpdate: "PUT /api/admin/courses/:slugOrId",
        courseDelete: "DELETE /api/admin/courses/:slugOrId"
      },
      content: {
        faqs: "GET /api/faqs (or /api/content/faqs)",
        testimonials: "GET /api/testimonials (or /api/content/testimonials)"
      }
    }
  });
});

// Route Mounts
router.use("/courses", courseRoute);
router.use("/mentors", mentorRoute);
router.use("/mentorship", mentorRoute);
router.use("/admissions", admissionsRoute);
router.use("/enrollments", enrollmentRoute);
router.use("/enrollment", enrollmentRoute);
router.use("/discussions", discussionRoute);
router.use("/community", discussionRoute);
router.use("/student", studentRoute);
router.use("/auth", authRoute);
router.use("/admin", adminRoute);
router.use("/content", contentRoute);
router.use("/", contentRoute); // Mounts /faqs and /testimonials directly

export default router;