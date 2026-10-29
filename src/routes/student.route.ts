import { Router } from "express";
import { studentController } from "../controllers/student.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { progressUpdateSchema } from "../validations/student.validation.js";

const router = Router();

// Protected student portal endpoints
router.get("/dashboard", authenticate, studentController.getDashboard);
router.get("/me", authenticate, studentController.getMe);
router.post("/progress", authenticate, validate({ body: progressUpdateSchema }), studentController.updateProgress);

export default router;
