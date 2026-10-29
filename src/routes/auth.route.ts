import { Router } from "express";
import { studentController } from "../controllers/student.controller.js";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/auth.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import {
  loginSchema,
  registerSchema,
  sendOtpSchema,
  verifyOtpSchema,
  resendOtpSchema
} from "../validations/auth.validation.js";

const router = Router();

// Core Authentication
router.post("/login", authLimiter, validate({ body: loginSchema }), studentController.login);
router.post("/register", authLimiter, validate({ body: registerSchema }), studentController.register);
router.get("/me", authenticate, studentController.getMe);

// OTP Verification for Registration
router.post("/send-otp", authLimiter, validate({ body: sendOtpSchema }), studentController.sendOtp);
router.post("/register/send-otp", authLimiter, validate({ body: sendOtpSchema }), studentController.sendOtp);

router.post("/verify-otp", authLimiter, validate({ body: verifyOtpSchema }), studentController.verifyOtp);
router.post("/register/verify-otp", authLimiter, validate({ body: verifyOtpSchema }), studentController.verifyOtp);

router.post("/resend-otp", authLimiter, validate({ body: resendOtpSchema }), studentController.resendOtp);
router.post("/register/resend-otp", authLimiter, validate({ body: resendOtpSchema }), studentController.resendOtp);

export default router;
