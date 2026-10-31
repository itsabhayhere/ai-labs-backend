import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("API Security & Integration Tests", () => {
  let authToken = "";
  const testEmail = `student_${Date.now()}@innovacio.edu`;

  describe("1. System Health & Directory", () => {
    it("GET /api/health should return ok with 200", async () => {
      const res = await request(app).get("/api/health");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe("ok");
    });

    it("GET /api should return endpoints directory with 200", async () => {
      const res = await request(app).get("/api");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.endpoints).toBeDefined();
    });

    it("GET /api/nonexistent-route should return 404 with structured error", async () => {
      const res = await request(app).get("/api/nonexistent-route");
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("ROUTE_NOT_FOUND");
    });
  });

  describe("2. Authentication & Authorization Security", () => {
    it("POST /api/auth/register should create student and return JWT token", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test Engineer",
          email: testEmail,
          password: "SecurePassword123!"
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(testEmail);
      expect(res.body.data.user.password).toBeUndefined(); // Never expose password hash

      authToken = res.body.data.token;
    });

    it("POST /api/auth/register should reject duplicate registration with 409", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test Engineer",
          email: testEmail,
          password: "SecurePassword123!"
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("ACCOUNT_EXISTS");
    });

    it("POST /api/admin/register should create a new administrator and return JWT", async () => {
      const adminEmail = `admin_test_${Date.now()}@innovacio.ai`;
      const res = await request(app)
        .post("/api/admin/register")
        .send({
          name: "Test Admin Officer",
          email: adminEmail,
          password: "AdminPassword@2026",
          role: "admin"
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(adminEmail);
      expect(res.body.data.user.role).toBe("admin");
      expect(res.body.data.user.password).toBeUndefined();
    });

    it("POST /api/auth/login should verify correct credentials and return JWT", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testEmail,
          password: "SecurePassword123!"
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it("POST /api/auth/login should reject invalid password with 401", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testEmail,
          password: "WrongPassword999"
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
    });

    it("GET /api/student/dashboard without token should return 401 UNAUTHORIZED", async () => {
      const res = await request(app).get("/api/student/dashboard");
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    it("GET /api/student/dashboard with valid Bearer token should return 200", async () => {
      const res = await request(app)
        .get("/api/student/dashboard")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.stats).toBeDefined();
    });
  });

  
    it("POST /api/auth/send-otp should initiate OTP registration and return devOtp", async () => {
      const otpTestEmail = `otp_student_${Date.now()}@innovacio.edu`;
      const res = await request(app)
        .post("/api/auth/send-otp")
        .send({
          name: "OTP Test Student",
          email: otpTestEmail,
          password: "SecureOtpPassword123!",
          phone: "+91 9876543210",
          preferredTrack: "genai"
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(otpTestEmail);
      expect(res.body.data.devOtp).toBeDefined();
      expect(res.body.data.devOtp).toHaveLength(6);

      const generatedOtp = res.body.data.devOtp;

      // Verification with incorrect OTP should fail
      const badRes = await request(app)
        .post("/api/auth/verify-otp")
        .send({
          email: otpTestEmail,
          otp: "000000"
        });
      expect(badRes.status).toBe(400);
      expect(badRes.body.success).toBe(false);

      // Verification with correct OTP should succeed and create user
      const goodRes = await request(app)
        .post("/api/auth/verify-otp")
        .send({
          email: otpTestEmail,
          otp: generatedOtp
        });
      expect(goodRes.status).toBe(201);
      expect(goodRes.body.success).toBe(true);
      expect(goodRes.body.data.token).toBeDefined();
      expect(goodRes.body.data.user.email).toBe(otpTestEmail);
    });

  describe("3. Zod Input Validation & NoSQL Injection Protection", () => {
    it("POST /api/auth/register with bad email format should return 400 VALIDATION_ERROR", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "John",
          email: "not-an-email",
          password: "short"
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
      expect(res.body.error.details.length).toBeGreaterThan(0);
    });

    it("POST /api/auth/login with NoSQL injection operator should be rejected with 400", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: { $gt: "" },
          password: "password123"
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("4. Courses API", () => {
    it("GET /api/courses should return courses array with 200", async () => {
      const res = await request(app).get("/api/courses");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("GET /api/courses/categories should return aggregated category counts", async () => {
      const res = await request(app).get("/api/courses/categories");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("GET /api/courses/:slugOrId with invalid identifier should return 404", async () => {
      const res = await request(app).get("/api/courses/non-existent-course-slug-12345");
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("COURSE_NOT_FOUND");
    });
  });

  describe("5. Mentorship Double-Booking Prevention", () => {
    const bookingDate = "2026-11-20";
    const bookingTimeSlot = "11:00 AM";

    it("POST /api/mentors/bookings should book a session", async () => {
      const res = await request(app)
        .post("/api/mentors/bookings")
        .send({
          mentorId: "anirban-das",
          sessionType: "Video Call",
          date: bookingDate,
          timeSlot: bookingTimeSlot,
          studentName: "Aditi Sen",
          studentEmail: "aditi@sen.com",
          studentPhone: "+91 9830123456"
        });

      expect([201, 409]).toContain(res.status); // 201 or already booked in previous run
    });

    it("POST /api/mentors/bookings should REJECT conflicting time slot with 409", async () => {
      const res = await request(app)
        .post("/api/mentors/bookings")
        .send({
          mentorId: "anirban-das",
          sessionType: "Video Call",
          date: bookingDate,
          timeSlot: bookingTimeSlot,
          studentName: "Another Student",
          studentEmail: "another@student.com",
          studentPhone: "+91 9999999999"
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("SLOT_CONFLICT");
    });
  });

  describe("6. Coupon Validation & Checkout Security", () => {
    it("POST /api/enrollments/verify-coupon with valid coupon INNOAI2026 returns discount", async () => {
      const res = await request(app)
        .post("/api/enrollments/verify-coupon")
        .send({
          code: "INNOAI2026",
          price: 75000
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.discountAmount).toBe(2000);
      expect(res.body.data.finalPrice).toBe(73000);
    });

    it("POST /api/enrollments/checkout recalculates price on server and sets pending status", async () => {
      const res = await request(app)
        .post("/api/enrollments/checkout")
        .send({
          courseId: "genai",
          name: "Test Checkout Student",
          email: `checkout_${Date.now()}@test.edu`,
          phone: "+91 9876543210",
          paymentOption: "full",
          couponCode: "EARLYBIRD"
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.paymentStatus).toBe("pending"); // Not marked as paid
      expect(res.body.data.status).toBe("pending_payment");
      expect(res.body.data.discountApplied).toBe(2000);
      expect(res.body.data.id).toMatch(/^INNO-ENR-/);
    });
  });

  describe("7. Discussion Duplicate Upvote Prevention", () => {
    it("POST /api/discussions/:id/upvote should prevent duplicate upvotes from same voter", async () => {
      // First upvote with authenticated token
      const res1 = await request(app)
        .post("/api/discussions/1/upvote")
        .set("Authorization", `Bearer ${authToken}`);

      // Second upvote with same voter should return 409
      const res2 = await request(app)
        .post("/api/discussions/1/upvote")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res2.status).toBe(409);
      expect(res2.body.success).toBe(false);
      expect(res2.body.error.code).toBe("DUPLICATE_UPVOTE");
    });
  });

  describe("8. Admissions Lead Intake", () => {
    it("POST /api/admissions/counseling validates and records inquiry", async () => {
      const res = await request(app)
        .post("/api/admissions/counseling")
        .send({
          name: "Priyanka Roy",
          email: "priyanka.roy@example.com",
          phone: "+91 9831122334",
          program: "genai",
          mode: "hybrid"
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
    });

    it("POST /api/admissions/brochure records request and returns safe prospectus metadata", async () => {
      const res = await request(app)
        .post("/api/admissions/brochure")
        .send({
          name: "Debayan Bose",
          email: "debayan@bose.org",
          phone: "+91 9830554433",
          course: "genai"
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.prospectus).toBeDefined();
      expect(res.body.data.prospectus.deliveryStatus).toBe("dispatched");
    });
  });
});
