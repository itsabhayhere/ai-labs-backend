import { z } from "zod";

export const verifyCouponSchema = z.object({
  code: z.string().trim().min(2, "Coupon code is required").max(30),
  price: z.number().nonnegative().optional()
});

export const checkoutSchema = z.object({
  courseId: z.string().trim().min(1, "Course ID is required"),
  name: z.string().trim().min(2, "Full name is required").max(100),
  email: z.string().trim().email("Valid email address is required"),
  phone: z.string().trim().min(8, "Valid phone number is required").max(20),
  mode: z.enum(["hybrid", "online", "offline"]).default("hybrid"),
  experience: z
    .enum(["student", "working_professional", "transitioning", "college_student", "executive"])
    .default("working_professional"),
  paymentOption: z.enum(["full", "deposit", "emi"]).default("full"),
  couponCode: z.string().trim().max(30).optional()
});
