import { DiscussionPost } from "../types/discussion.js";

export const INITIAL_DISCUSSIONS: DiscussionPost[] = [
  {
    id: 1,
    title: "Welcome to Innovacio AI Labs Community! Code of Conduct & Guidelines",
    content: "Welcome to all cohort students, mentors, and alumni! Use this space to discuss lab exercises, debug code, ask architectural questions, and collaborate on capstone projects. Our instructors and mentors check this channel daily.",
    category: "General Discussion",
    tags: ["Guidelines", "Welcome", "Cohort-2026"],
    author: {
      name: "Anirban Das",
      role: "Instructor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
    },
    upvotes: 42,
    repliesCount: 12,
    viewsCount: 1240,
    isPinned: true,
    isTrending: true,
    replies: [
      {
        id: 101,
        author: {
          name: "Rohan Kapoor",
          role: "Mentor",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
        },
        content: "Excited to mentor this cohort! Feel free to ping for Data Science and ML query reviews.",
        upvotes: 8,
        createdAt: "2026-10-25T10:30:00.000Z"
      }
    ],
    createdAt: "2026-10-24T08:00:00.000Z"
  },
  {
    id: 2,
    title: "LangGraph vs CrewAI: Which state machine performs better for complex enterprise multi-agent workflows?",
    content: "In Week 5 of the GenAI program, we're exploring multi-agent reflection loops. When benchmarking state persistence across 50+ turns, how do you handle state recovery and tool rollback gracefully?",
    category: "Generative AI",
    tags: ["LangGraph", "CrewAI", "Multi-Agent", "RAG"],
    author: {
      name: "Debayan Mukherjee",
      role: "Student",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
    },
    upvotes: 28,
    repliesCount: 8,
    viewsCount: 840,
    isPinned: false,
    isTrending: true,
    replies: [
      {
        id: 102,
        author: {
          name: "Anirban Das",
          role: "Instructor",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
        },
        content: "Great observation! LangGraph provides explicit conditional edges and durable checkpoints via SQLite or PostgreSQL, which gives you deterministic state recovery.",
        upvotes: 14,
        createdAt: "2026-10-26T14:15:00.000Z"
      }
    ],
    createdAt: "2026-10-26T11:20:00.000Z"
  },
  {
    id: 3,
    title: "Optimizing Pinecone Index Latency with Hybrid Dense/Sparse Search (BM25 + Splade)",
    content: "Sharing my benchmark results on our 2M legal document corpus. Implementing Cohere re-ranking after hybrid retrieval reduced top-5 hallucination rates by 41%.",
    category: "Generative AI",
    tags: ["Pinecone", "VectorDB", "Hybrid-Search", "Optimization"],
    author: {
      name: "Ritwika Sengupta",
      role: "Alumni",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80"
    },
    upvotes: 35,
    repliesCount: 6,
    viewsCount: 920,
    isPinned: false,
    isTrending: true,
    replies: [],
    createdAt: "2026-10-27T09:40:00.000Z"
  },
  {
    id: 4,
    title: "Best practices for containerizing PyTorch inference with vLLM on Kubernetes",
    content: "Has anyone configured continuous batching on AWS EKS with g5.2xlarge instances? Looking for tips on GPU memory allocation limits.",
    category: "Machine Learning",
    tags: ["Kubernetes", "vLLM", "AWS", "PyTorch"],
    author: {
      name: "Vikram Singh",
      role: "Mentor",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
    },
    upvotes: 19,
    repliesCount: 4,
    viewsCount: 510,
    isPinned: false,
    isTrending: false,
    replies: [],
    createdAt: "2026-10-27T16:00:00.000Z"
  }
];
