import { Router } from "express";
import { mentorController } from "../controllers/mentor.controller.js";
import { validate } from "../middlewares/validate.js";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { checkoutLimiter } from "../middlewares/rateLimiter.js";
import {
  mentorQuerySchema,
  mentorIdParamSchema,
  createBookingSchema
} from "../validations/mentor.validation.js";

const router = Router();

router.get("/", validate({ query: mentorQuerySchema }), mentorController.getAll);
router.get("/bookings", authenticate, requireRole(["admin", "mentor"]), mentorController.getBookings);
router.get("/:id", validate({ params: mentorIdParamSchema }), mentorController.getById);

// Booking endpoints (both /bookings and /book supported for frontend consistency)
router.post(
  "/bookings",
  checkoutLimiter,
  validate({ body: createBookingSchema }),
  mentorController.createBooking
);
router.post(
  "/book",
  checkoutLimiter,
  validate({ body: createBookingSchema }),
  mentorController.createBooking
);

export default router;
