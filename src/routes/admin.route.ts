import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";
import { authenticate, requireAdmin } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import {
  adminLoginSchema,
  adminStudentQuerySchema,
  adminCourseQuerySchema,
  adminStudentIdParamSchema,
  adminUpdateStudentSchema
} from "../validations/admin.validation.js";
import {
  createCourseSchema,
  updateCourseSchema,
  courseSlugOrIdParamSchema
} from "../validations/course.validation.js";

const router = Router();

// ─── PUBLIC ADMIN AUTHENTICATION ──────────────────────────────────────
router.post(
  "/login",
  authLimiter,
  validate({ body: adminLoginSchema }),
  adminController.login
);
router.post("/logout", adminController.logout);

// ─── PROTECTED ADMIN ROUTES (REQUIRE AUTHENTICATE + ADMIN ROLE) ───────
router.use(authenticate, requireAdmin);

// Admin Profile
router.get("/me", adminController.getMe);

// ─── DASHBOARD STATS ──────────────────────────────────────────────────
router.get("/stats", adminController.getDashboardStats);
router.get("/dashboard", adminController.getDashboardStats);

// ─── STUDENT MANAGEMENT ───────────────────────────────────────────────
router.get(
  "/students",
  validate({ query: adminStudentQuerySchema }),
  adminController.getStudents
);

router.get(
  "/students/:id",
  validate({ params: adminStudentIdParamSchema }),
  adminController.getStudentById
);

router.put(
  "/students/:id",
  validate({ params: adminStudentIdParamSchema, body: adminUpdateStudentSchema }),
  adminController.updateStudent
);

router.delete(
  "/students/:id",
  validate({ params: adminStudentIdParamSchema }),
  adminController.deleteStudent
);

// ─── COURSE MANAGEMENT (CRUD) ─────────────────────────────────────────
router.get(
  "/courses",
  validate({ query: adminCourseQuerySchema }),
  adminController.getCourses
);

router.get(
  "/courses/:slugOrId",
  validate({ params: courseSlugOrIdParamSchema }),
  adminController.getCourseById
);

router.post(
  "/courses",
  validate({ body: createCourseSchema }),
  adminController.createCourse
);

router.put(
  "/courses/:slugOrId",
  validate({ params: courseSlugOrIdParamSchema, body: updateCourseSchema }),
  adminController.updateCourse
);

router.delete(
  "/courses/:slugOrId",
  validate({ params: courseSlugOrIdParamSchema }),
  adminController.deleteCourse
);

export default router;
