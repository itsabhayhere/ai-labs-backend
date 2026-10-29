import { Request, Response, NextFunction } from "express";
import { discussionService } from "../services/discussion.service.js";

export const discussionController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { tab, category, search } = req.query;
      const posts = await discussionService.getAll({
        tab: tab as any,
        category: category ? String(category) : undefined,
        search: search ? String(search) : undefined
      });

      res.json({
        success: true,
        message: "Discussion topics retrieved successfully.",
        count: posts.length,
        data: posts
      });
    } catch (err) {
      next(err);
    }
  },

  async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await discussionService.getCategories();
      res.json({
        success: true,
        data: categories
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id || ""), 10);
      const post = await discussionService.getById(id);
      if (!post) {
        return res.status(404).json({
          success: false,
          error: {
            code: "TOPIC_NOT_FOUND",
            message: `Discussion post not found for ID '${id}'`
          }
        });
      }

      res.json({
        success: true,
        data: post
      });
    } catch (err) {
      next(err);
    }
  },

  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const authorUser = req.user ? { name: req.user.name, role: req.user.role } : undefined;
      const post = await discussionService.createPost(req.body, authorUser);
      res.status(201).json({
        success: true,
        message: "Your discussion topic has been published to the community!",
        data: post
      });
    } catch (err) {
      next(err);
    }
  },

  async upvote(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id || ""), 10);
      const voterId = req.user?.id || req.user?.email || (req.ip || "anonymous_user");

      const result = await discussionService.upvote(id, voterId);
      res.json({
        success: true,
        message: "Upvoted post!",
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  async addReply(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id || ""), 10);
      const { content, author } = req.body;
      const authorUser = req.user
        ? { name: req.user.name, role: req.user.role }
        : author;

      const updatedPost = await discussionService.addReply(id, content, authorUser);
      res.status(201).json({
        success: true,
        message: "Reply posted successfully",
        data: updatedPost
      });
    } catch (err) {
      next(err);
    }
  }
};
