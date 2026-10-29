import mongoose, { Schema, Document } from "mongoose";
import { DiscussionPost } from "../types/discussion.js";

export type DiscussionDocument = DiscussionPost & Document;

const ReplySchema = new Schema(
  {
    id: { type: Number, required: true },
    author: {
      name: { type: String, required: true, trim: true },
      role: { type: String, required: true },
      avatar: { type: String, required: true }
    },
    content: { type: String, required: true, trim: true, maxlength: 2000 },
    upvotes: { type: Number, default: 0 },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { _id: false }
);

const DiscussionSchema = new Schema<DiscussionDocument>(
  {
    id: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 250 },
    content: { type: String, required: true, trim: true, maxlength: 5000 },
    category: { type: String, required: true, index: true, trim: true },
    tags: [{ type: String, trim: true }],
    author: {
      name: { type: String, required: true, trim: true },
      role: { type: String, required: true },
      avatar: { type: String, required: true }
    },
    upvotes: { type: Number, default: 0, min: 0 },
    upvotedBy: [{ type: String, index: true }],
    repliesCount: { type: Number, default: 0, min: 0 },
    viewsCount: { type: Number, default: 0, min: 0 },
    isPinned: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    replies: [ReplySchema]
  },
  { timestamps: true }
);

export const DiscussionModel = mongoose.model<DiscussionDocument>(
  "Discussion",
  DiscussionSchema
);
