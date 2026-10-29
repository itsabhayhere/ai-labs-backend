export interface Enrollment {
  id: string;
  courseId: string;
  courseTitle: string;
  name: string;
  email: string;
  phone: string;
  mode: "hybrid" | "online" | "offline";
  experience: "student" | "working_professional" | "transitioning";
  paymentOption: "full" | "deposit" | "emi";
  couponCode?: string;
  discountApplied: number;
  finalPrice: number;
  currency: string;
  paymentStatus?: "pending" | "completed" | "failed";
  status: "confirmed" | "pending_payment" | "cancelled";
  createdAt: string;
}

export interface CheckoutInput {
  courseId: string;
  name: string;
  email: string;
  phone: string;
  mode?: "hybrid" | "online" | "offline";
  experience?: "student" | "working_professional" | "transitioning";
  paymentOption?: "full" | "deposit" | "emi";
  couponCode?: string;
}

export interface Coupon {
  code: string;
  discountAmount: number;
  description: string;
  active: boolean;
}
