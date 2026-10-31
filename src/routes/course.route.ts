import { Router } from "express";
import { courseController } from "../controllers/course.controller.js";
import { validate } from "../middlewares/validate.js";
import { authenticate, requireAdmin } from "../middlewares/auth.js";
import {
  courseQuerySchema,
  courseSlugOrIdParamSchema,
  courseSlugParamSchema,
  createCourseSchema,
  updateCourseSchema
} from "../validations/course.validation.js";

const router = Router();

router.get("/", validate({ query: courseQuerySchema }), courseController.getAll);
router.get("/categories", courseController.getCategories);
router.get("/slug/:slug", validate({ params: courseSlugParamSchema }), courseController.getByIdOrSlug);
router.get("/:slugOrId", validate({ params: courseSlugOrIdParamSchema }), courseController.getByIdOrSlug);

// Protected administrative course mutation endpoints
router.post(
  "/",
  authenticate,
  requireAdmin,
  validate({ body: createCourseSchema }),
  courseController.create
);
router.put(
  "/:slugOrId",
  authenticate,
  requireAdmin,
  validate({ params: courseSlugOrIdParamSchema, body: updateCourseSchema }),
  courseController.update
);
router.delete(
  "/:slugOrId",
  authenticate,
  requireAdmin,
  validate({ params: courseSlugOrIdParamSchema }),
  courseController.delete
);

export default router;