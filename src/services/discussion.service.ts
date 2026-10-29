import mongoose from "mongoose";
import { DiscussionPost, CreatePostInput, DiscussionAuthor } from "../types/discussion.js";
import { DiscussionModel } from "../models/Discussion.model.js";
import { INITIAL_DISCUSSIONS } from "../data/discussionsData.js";

let inMemoryDiscussions: DiscussionPost[] = [...INITIAL_DISCUSSIONS];
let nextPostId = 20;
let nextReplyId = 300;

function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export const discussionService = {
  async getAll(filters: {
    tab?: "latest" | "trending" | "unanswered" | "my-posts";
    category?: string;
    search?: string;
  } = {}): Promise<DiscussionPost[]> {
    if (isDbConnected()) {
      const query: any = {};
      if (filters.category && filters.category !== "all" && filters.category !== "instructor-replies") {
        query.category = { $regex: new RegExp(`^${filters.category}$`, "i") };
      }
      if (filters.category === "instructor-replies") {
        query["replies.author.role"] = "Instructor";
      }
      if (filters.search && filters.search.trim()) {
        const regex = { $regex: new RegExp(filters.search.trim(), "i") };
        query.$or = [{ title: regex }, { content: regex }, { tags: regex }, { "author.name": regex }];
      }
      if (filters.tab === "unanswered") {
        query.repliesCount = 0;
      }

      let sortOption: any = {};
      if (filters.tab === "trending") {
        sortOption = { upvotes: -1, repliesCount: -1 };
      } else if (filters.tab === "latest") {
        sortOption = { createdAt: -1 };
      } else {
        sortOption = { isPinned: -1, createdAt: -1 };
      }

      const docs = await DiscussionModel.find(query).sort(sortOption).lean();
      return docs as unknown as DiscussionPost[];
    }

    // In-memory fallback
    let result = [...inMemoryDiscussions];
    if (filters.category && filters.category !== "all") {
      result = result.filter(
        (p) => p.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.author.name.toLowerCase().includes(q)
      );
    }

    if (filters.tab === "trending") {
      result.sort((a, b) => b.upvotes + b.repliesCount - (a.upvotes + a.repliesCount));
    } else if (filters.tab === "unanswered") {
      result = result.filter((p) => p.repliesCount === 0);
    } else if (filters.tab === "latest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  },

  async getById(id: number): Promise<DiscussionPost | undefined> {
    if (isDbConnected()) {
      const doc = await DiscussionModel.findOneAndUpdate(
        { id },
        { $inc: { viewsCount: 1 } },
        { returnDocument: "after" }
      ).lean();
      if (doc) return doc as unknown as DiscussionPost;
    }

    const post = inMemoryDiscussions.find((p) => p.id === id);
    if (post) {
      post.viewsCount += 1;
    }
    return post;
  },

  async createPost(data: CreatePostInput, authorUser?: { name: string; role: string }): Promise<DiscussionPost> {
    const author: DiscussionAuthor = {
      name: authorUser?.name || data.authorName || "Student Developer",
      role: (authorUser?.role === "admin" ? "Instructor" : (data.authorRole || "Student")) as any,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
    };

    let newId = nextPostId++;
    if (isDbConnected()) {
      const last = await DiscussionModel.findOne().sort({ id: -1 });
      if (last) newId = last.id + 1;
    }

    const newPost: DiscussionPost = {
      id: newId,
      title: data.title.trim(),
      content: data.content.trim(),
      category: data.category || "General Discussion",
      tags: data.tags && data.tags.length > 0 ? data.tags : ["General"],
      author,
      upvotes: 1,
      upvotedBy: [author.name],
      repliesCount: 0,
      viewsCount: 1,
      isPinned: false,
      isTrending: false,
      replies: [],
      createdAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      await DiscussionModel.create(newPost);
    }
    inMemoryDiscussions.unshift(newPost);
    return newPost;
  },

  async upvote(id: number, voterId: string): Promise<{ id: number; upvotes: number; upvoted: boolean }> {
    if (isDbConnected()) {
      const existing = await DiscussionModel.findOne({ id }).lean();
      if (!existing) {
        const err: any = new Error("Discussion topic not found.");
        err.statusCode = 404;
        err.code = "TOPIC_NOT_FOUND";
        throw err;
      }

      // Check if user already upvoted
      const alreadyVoted = existing.upvotedBy?.includes(voterId);
      if (alreadyVoted) {
        const err: any = new Error("You have already upvoted this topic.");
        err.statusCode = 409;
        err.code = "DUPLICATE_UPVOTE";
        throw err;
      }

      const doc = await DiscussionModel.findOneAndUpdate(
        { id },
        { $addToSet: { upvotedBy: voterId }, $inc: { upvotes: 1 } },
        { returnDocument: "after" }
      ).lean();

      return { id: doc!.id, upvotes: doc!.upvotes, upvoted: true };
    }

    // In-memory fallback
    const post = inMemoryDiscussions.find((p) => p.id === id);
    if (!post) {
      const err: any = new Error("Discussion topic not found.");
      err.statusCode = 404;
      err.code = "TOPIC_NOT_FOUND";
      throw err;
    }

    post.upvotedBy = post.upvotedBy || [];
    if (post.upvotedBy.includes(voterId)) {
      const err: any = new Error("You have already upvoted this topic.");
      err.statusCode = 409;
      err.code = "DUPLICATE_UPVOTE";
      throw err;
    }

    post.upvotedBy.push(voterId);
    post.upvotes += 1;
    return { id: post.id, upvotes: post.upvotes, upvoted: true };
  },

  async addReply(
    id: number,
    content: string,
    authorUser?: { name: string; role: string; avatar?: string }
  ): Promise<DiscussionPost> {
    const reply = {
      id: nextReplyId++,
      author: {
        name: authorUser?.name || "Student Contributor",
        role: (authorUser?.role === "admin" ? "Instructor" : "Student") as any,
        avatar:
          authorUser?.avatar ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
      },
      content: content.trim(),
      upvotes: 0,
      createdAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      const doc = await DiscussionModel.findOneAndUpdate(
        { id },
        { $push: { replies: reply }, $inc: { repliesCount: 1 } },
        { returnDocument: "after" }
      ).lean();

      if (!doc) {
        const err: any = new Error("Discussion topic not found.");
        err.statusCode = 404;
        err.code = "TOPIC_NOT_FOUND";
        throw err;
      }
      return doc as unknown as DiscussionPost;
    }

    const post = inMemoryDiscussions.find((p) => p.id === id);
    if (!post) {
      const err: any = new Error("Discussion topic not found.");
      err.statusCode = 404;
      err.code = "TOPIC_NOT_FOUND";
      throw err;
    }
    post.replies.push(reply as any);
    post.repliesCount = post.replies.length;
    return post;
  },

  async getCategories() {
    if (isDbConnected()) {
      const results = await DiscussionModel.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $project: { category: "$_id", count: 1, _id: 0 } }
      ]);
      const total = await DiscussionModel.countDocuments();
      return [{ category: "all", count: total }, ...results];
    }

    const categories = ["all", "General Discussion", "Generative AI", "Machine Learning", "Data Science", "Cybersecurity"];
    return categories.map((cat) => ({
      category: cat,
      count: cat === "all" ? inMemoryDiscussions.length : inMemoryDiscussions.filter((d) => d.category.toLowerCase() === cat.toLowerCase()).length
    }));
  }
};
