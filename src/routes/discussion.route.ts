import { Router } from "express";
import { discussionController } from "../controllers/discussion.controller.js";
import { validate } from "../middlewares/validate.js";
import { optionalAuthenticate } from "../middlewares/auth.js";
import {
  discussionQuerySchema,
  discussionIdParamSchema,
  createPostSchema,
  replySchema
} from "../validations/discussion.validation.js";

const router = Router();

router.get("/", validate({ query: discussionQuerySchema }), discussionController.getAll);
router.get("/categories", discussionController.getCategories);
router.get("/:id", validate({ params: discussionIdParamSchema }), discussionController.getById);

router.post(
  "/",
  optionalAuthenticate,
  validate({ body: createPostSchema }),
  discussionController.createPost
);
router.post(
  "/:id/upvote",
  optionalAuthenticate,
  validate({ params: discussionIdParamSchema }),
  discussionController.upvote
);

// Support both /:id/reply and /:id/replies
router.post(
  "/:id/reply",
  optionalAuthenticate,
  validate({ params: discussionIdParamSchema, body: replySchema }),
  discussionController.addReply
);
router.post(
  "/:id/replies",
  optionalAuthenticate,
  validate({ params: discussionIdParamSchema, body: replySchema }),
  discussionController.addReply
);

export default router;
