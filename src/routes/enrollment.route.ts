import { Router } from "express";
import { enrollmentController } from "../controllers/enrollment.controller.js";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/auth.js";
import { checkoutLimiter } from "../middlewares/rateLimiter.js";
import { verifyCouponSchema, checkoutSchema } from "../validations/enrollment.validation.js";

const router = Router();

// Support both /verify-coupon and /validate-coupon
router.post(
  "/verify-coupon",
  validate({ body: verifyCouponSchema }),
  enrollmentController.verifyCoupon
);
router.post(
  "/validate-coupon",
  validate({ body: verifyCouponSchema }),
  enrollmentController.verifyCoupon
);

router.post(
  "/checkout",
  checkoutLimiter,
  validate({ body: checkoutSchema }),
  enrollmentController.checkout
);

router.get("/", authenticate, enrollmentController.getAll);

export default router;
