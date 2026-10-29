export interface DiscussionAuthor {
  name: string;
  role: "Instructor" | "Student" | "Mentor" | "Alumni";
  avatar: string;
}

export interface DiscussionReply {
  id: number;
  author: DiscussionAuthor;
  content: string;
  upvotes: number;
  createdAt: string;
}

export interface DiscussionPost {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: DiscussionAuthor;
  upvotes: number;
  upvotedBy?: string[];
  repliesCount: number;
  viewsCount: number;
  isPinned?: boolean;
  isTrending?: boolean;
  replies: DiscussionReply[];
  createdAt: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  authorName?: string;
  authorRole?: "Instructor" | "Student" | "Mentor" | "Alumni";
}
