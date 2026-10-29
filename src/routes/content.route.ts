import { Router } from "express";
import { contentController } from "../controllers/content.controller.js";

const router = Router();

router.get("/faqs", contentController.getFaqs);
router.get("/testimonials", contentController.getTestimonials);

// Additional path aliases for frontend flexibility
router.get("/content/faqs", contentController.getFaqs);
router.get("/content/testimonials", contentController.getTestimonials);

export default router;
