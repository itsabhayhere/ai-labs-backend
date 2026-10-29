import { Router } from "express";
import { admissionsController } from "../controllers/admissions.controller.js";
import { validate } from "../middlewares/validate.js";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { admissionsLimiter } from "../middlewares/rateLimiter.js";
import {
  counselingSchema,
  brochureSchema,
  campusVisitSchema
} from "../validations/admissions.validation.js";

const router = Router();

router.post(
  "/counseling",
  admissionsLimiter,
  validate({ body: counselingSchema }),
  admissionsController.createCounseling
);
router.get("/counseling", authenticate, requireRole(["admin"]), admissionsController.getCounselings);

router.post(
  "/brochure",
  admissionsLimiter,
  validate({ body: brochureSchema }),
  admissionsController.createBrochure
);
router.get("/brochure", authenticate, requireRole(["admin"]), admissionsController.getBrochures);

router.post(
  "/campus-visit",
  admissionsLimiter,
  validate({ body: campusVisitSchema }),
  admissionsController.createCampusVisit
);
router.get("/campus-visit", authenticate, requireRole(["admin"]), admissionsController.getCampusVisits);

export default router;
