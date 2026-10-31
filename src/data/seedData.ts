import { Course } from "../types/course.js";
export type { Course };

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  sessionsCount: string;
  bio: string;
  skills: string[];
  experience: string;
  pricePerSession: string;
  priceNum: number;
  badge?: string;
  availability: string;
  modes: string[];
  languages: string[];
}

export const COURSES: Course[] = [
  {
    id: "full-stack-development-with-ai-advanced-plus",
    slug: "full-stack-development-with-ai-advanced-plus",
    title: "Full Stack Development with AI - Advanced Plus",
    positioning: "A beginner-friendly, project-led path from web fundamentals to deploying a complete web application, with AI coding tools used responsibly throughout the workflow, extending into production-grade engineering and advanced AI integrations.",
    audience: "Freshers, beginners, non-CS graduates and career switchers who want to build web applications and demonstrate practical skills.",
    duration: {
      total: "6 to 6.5 months",
      breakdown: "Advanced (4 months / 16 weeks) + Advanced Plus (additional 8–10 weeks)"
    },
    coreStack: [
      "HTML",
      "CSS",
      "Tailwind CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Express",
      "PostgreSQL",
      "MongoDB",
      "NextJs",
      "Docker",
      "Git/GitHub",
      "AWS (S3, EC2, Amplify)"
    ],
    curriculum: {
      advancedPhase: [
        {
          timeframe: "Month 1",
          module: "Developer & web foundations",
          coreTopics: [
            "File system and terminal basics",
            "VS Code",
            "Git and GitHub",
            "How the web works",
            "Browser DevTools",
            "DNS, HTTP/HTTPS, client/server and request-response",
            "Semantic HTML",
            "CSS, responsive layouts and Tailwind CSS"
          ],
          assignmentTypes: [
            "Publish a responsive multi-page website",
            "Maintain a GitHub repository"
          ]
        },
        {
          timeframe: "Month 1-2",
          module: "JavaScript, TypeScript & frontend",
          coreTopics: [
            "JavaScript fundamentals: functions, objects, arrays and modules",
            "DOM/events",
            "Async JavaScript, promises and fetch",
            "JSON and error handling",
            "TypeScript basics",
            "React components, props, state, hooks, forms, routing and API data fetching"
          ],
          assignmentTypes: [
            "Build an interactive frontend with routing, forms and API integration"
          ]
        },
        {
          timeframe: "Month 3-4",
          module: "Frontend project & backend",
          coreTopics: [
            "Frontend architecture and reusable components",
            "State management with React fundamentals and Redux Toolkit where justified",
            "Node.js runtime and Express",
            "REST APIs",
            "Request validation",
            "Authentication and authorization",
            "Error handling",
            "Environment variables and basic web security"
          ],
          assignmentTypes: [
            "Complete a frontend capstone and a documented backend API"
          ]
        },
        {
          timeframe: "Month 4",
          module: "Databases, integration & deployment",
          coreTopics: [
            "PostgreSQL as the primary database (SQL queries, joins, schema design and indexes)",
            "MongoDB fundamentals and relational-vs-document trade-offs",
            "Frontend/backend integration",
            "Testing basics",
            "Debugging",
            "Deployment",
            "Environment and secrets management",
            "Project documentation and demo"
          ],
          assignmentTypes: [
            "Deploy a full-stack capstone and present design decisions, testing and known limitations"
          ]
        }
      ],
      aiIntegrationPhase: {
        topics: [
          "Prompt Engineering",
          "How to use AI agents while coding",
          "Use of different AI models (Claude, Cursor, Antigravity)"
        ]
      },
      advancedPlusPhase: [
        {
          moduleNumber: 1,
          moduleName: "AI-assisted / agentic engineering",
          relevantTopics: [
            "Prompt and context engineering",
            "Task planning",
            "Agent instructions",
            "Tool permissions",
            "Coding-agent workflows",
            "Iterative loops",
            "Verification and stopping criteria",
            "Managing token/context limits"
          ]
        },
        {
          moduleNumber: 2,
          moduleName: "Production backend features",
          relevantTopics: [
            "Redis fundamentals for caching and rate limiting",
            "Background jobs and queues at a conceptual/practical level",
            "API versioning",
            "Safer authentication",
            "Logging and error observability"
          ]
        },
        {
          moduleNumber: 3,
          moduleName: "Containers and deployment",
          relevantTopics: [
            "Docker images and containers",
            "Environment configuration",
            "CI/CD basics",
            "Managed deployment",
            "Intro to EC2 and serverless options",
            "Secrets and operational checks"
          ]
        },
        {
          moduleNumber: 4,
          moduleName: "Testing and performance",
          relevantTopics: [
            "Unit, integration and end-to-end testing",
            "API testing",
            "Database indexing",
            "Browser and API performance",
            "Load testing fundamentals",
            "Bottleneck diagnosis and optimization"
          ]
        },
        {
          moduleNumber: 5,
          moduleName: "AI features in web products",
          relevantTopics: [
            "Integrate an LLM API",
            "Structured outputs",
            "Streaming or tool calling where appropriate",
            "Basic retrieval over documents as an optional capstone feature",
            "Cost, latency, fallback and error handling"
          ]
        },
        {
          moduleNumber: 6,
          moduleName: "Optional mobile sprint",
          relevantTopics: [
            "React Native fundamentals",
            "Mobile companion screen or app connected to the existing backend (treated as a scoped extension)"
          ]
        }
      ]
    },
    projectCheckpoints: [
      {
        checkpoint: "A",
        description: "Responsive landing page or product dashboard, deployed with a clean Git history."
      },
      {
        checkpoint: "B",
        description: "Frontend application with authentication flow, routing, forms and API integration."
      },
      {
        checkpoint: "Capstone",
        description: "A multi-user full-stack product (learning management mini-platform, job tracker, booking system or inventory tool) requiring CRUD, authentication, validation, database persistence, error states and deployment."
      },
      {
        checkpoint: "Final Steps",
        description: "One on One project interview and project showcasing, Certificate Providing, and Future Steps planning."
      }
    ],
    careerSupportBundle: [
      {
        service: "Resume and LinkedIn review",
        details: "Focused on evidence, impact, skills and accurate project descriptions; ATS-friendly formatting and keyword alignment without promising a specific ATS score."
      },
      {
        service: "GitHub and portfolio review",
        details: "README quality, setup instructions, screenshots, architecture notes, tests, commit history and deployed links."
      },
      {
        service: "Mock interviews",
        details: "JavaScript/TypeScript, frontend/backend fundamentals, API and database design, debugging, project deep-dives and behavioral rounds."
      },
      {
        service: "Structured mentor reviews",
        details: "Code review, project checkpoints, architecture feedback and a written learner action plan."
      },
      {
        service: "Real-world brief",
        details: "Ideally a partner or mentor-provided brief. Labelled as an industry-style project (not a client project) if no external client is secured."
      }
    ],
    successMetrics: [
      {
        metric: "Completion",
        description: "Learners deploy one full-stack app and can explain key flows without relying on an AI agent during the review."
      },
      {
        metric: "Engineering quality",
        description: "README and setup are complete, no secrets are committed, and the learner can explain data model and API choices."
      },
      {
        metric: "Career readiness",
        description: "Resume/portfolio review completed, at least two mock interviews, and a documented improvement plan."
      }
    ]
  }
];

export const MENTORS: Mentor[] = [
  {
    id: "anirban-das",
    name: "Anirban Das",
    role: "AI Research Engineer",
    company: "Google",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    rating: 4.9,
    sessionsCount: "120+ sessions",
    bio: "Specializes in Generative AI, LLMs and RAG systems. 6+ years of experience in building production AI systems at scale.",
    skills: ["Generative AI", "LLMs", "RAG", "LangChain"],
    experience: "6+ Years",
    pricePerSession: "₹2,000",
    priceNum: 2000,
    badge: "Top Mentor",
    availability: "This Week",
    modes: ["Video Call", "In-Person (Kolkata)"],
    languages: ["English", "Hindi"]
  },
  {
    id: "priya-mehta",
    name: "Priya Mehta",
    role: "Senior ML Engineer",
    company: "Microsoft",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    rating: 4.8,
    sessionsCount: "90+ sessions",
    bio: "Expert in machine learning, MLOps and scalable AI infrastructure. Previously worked at Microsoft and Uber.",
    skills: ["Machine Learning", "MLOps", "Python", "AWS"],
    experience: "7+ Years",
    pricePerSession: "₹1,800",
    priceNum: 1800,
    badge: "Top Mentor",
    availability: "Available Today",
    modes: ["Video Call"],
    languages: ["English"]
  },
  {
    id: "rohan-kapoor",
    name: "Rohan Kapoor",
    role: "Data Scientist",
    company: "Amazon",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    rating: 4.8,
    sessionsCount: "75+ sessions",
    bio: "Expert in data science, analytics and real-world ML applications. Helps with projects, assignments and career growth.",
    skills: ["Data Science", "Analytics", "SQL", "Python"],
    experience: "5+ Years",
    pricePerSession: "₹1,500",
    priceNum: 1500,
    badge: "Top Mentor",
    availability: "Weekends",
    modes: ["Video Call", "In-Person (Kolkata)"],
    languages: ["English", "Hindi"]
  },
  {
    id: "sneha-iyer",
    name: "Sneha Iyer",
    role: "AI Product Manager",
    company: "Meta",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    rating: 4.9,
    sessionsCount: "60+ sessions",
    bio: "Product and strategy expert in AI products. Helps with career guidance, interview preparation and industry insights.",
    skills: ["AI Strategy", "Product Management", "Career"],
    experience: "8+ Years",
    pricePerSession: "₹2,500",
    priceNum: 2500,
    badge: "Available Today",
    availability: "Available Today",
    modes: ["Video Call"],
    languages: ["English"]
  },
  {
    id: "vikram-singh",
    name: "Vikram Singh",
    role: "Cloud AI Architect",
    company: "AWS",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    rating: 4.7,
    sessionsCount: "40+ sessions",
    bio: "Specializes in cloud infrastructure, MLOps and deploying AI at scale. 10+ years of experience in enterprise solutions.",
    skills: ["AWS", "GCP", "MLOps", "Kubernetes"],
    experience: "10+ Years",
    pricePerSession: "₹2,000",
    priceNum: 2000,
    availability: "Flexible Schedule",
    modes: ["Video Call"],
    languages: ["English"]
  },
  {
    id: "kavya-nair",
    name: "Kavya Nair",
    role: "Cybersecurity Expert",
    company: "Palo Alto Networks",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    rating: 4.8,
    sessionsCount: "35+ sessions",
    bio: "Focuses on AI security, ethical hacking and secure AI systems. Helps with projects and career transitions.",
    skills: ["Cybersecurity", "Ethical AI", "Security", "SOC"],
    experience: "6+ Years",
    pricePerSession: "₹1,800",
    priceNum: 1800,
    availability: "This Week",
    modes: ["Video Call"],
    languages: ["English"]
  }
];

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug || c.id === slug);
}

export interface FAQItem {
  category: "admissions" | "curriculum" | "placements" | "campus" | "all";
  question: string;
  answer: string;
}

export const FAQS: FAQItem[] = [
  {
    category: "curriculum",
    question: "What hardware and GPU infrastructure do students get access to?",
    answer: "Every enrolled student receives dedicated high-performance cloud compute access with NVIDIA H100 and A100 GPU clusters for fine-tuning LLMs, training multi-agent systems, and running model checkpoints.",
  },
  {
    category: "admissions",
    question: "Is there flexible payment and EMI options available?",
    answer: "Yes, Innovacio AI Labs partners with leading NBFCs to offer zero-cost 12-month and 24-month EMI plans starting from ₹6,250/month with nominal down payment.",
  },
  {
    category: "campus",
    question: "Where is the campus located and are classes in-person?",
    answer: "Our flagship innovation campus is centrally situated on Park Street, Kolkata. We offer hybrid, fully offline in-person weekend cohorts, and interactive live virtual classrooms.",
  },
  {
    category: "placements",
    question: "What placement and career support is provided?",
    answer: "Students receive dedicated 1-on-1 career coaching, portfolio reviews, mock technical interviews with Ex-FAANG staff, and direct referral opportunities across our 80+ hiring partner network with a 98% placement support track record.",
  },
  {
    category: "curriculum",
    question: "Do I get a verified dual certificate upon completion?",
    answer: "Yes, graduates receive an industry-recognized certificate from Innovacio AI Labs, co-accredited with international technology partner bodies, with verifiable cryptographic badges.",
  },
];

export interface Testimonial {
  name: string;
  program: string;
  location: string;
  beforeRole: string;
  beforeComp: string;
  currentRole: string;
  currentComp: string;
  company: string;
  quote: string;
  avatar?: string;
  role?: string;
  badge?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Arjun Mukherjee",
    role: "AI Engineer at Adobe • ₹34 LPA",
    badge: "Alumni 2025",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    program: "Generative AI Engineering",
    location: "Kolkata Cohort",
    beforeRole: "Full Stack Engineer",
    beforeComp: "₹9.0 LPA",
    currentRole: "AI Engineer",
    currentComp: "₹34.0 LPA",
    company: "Adobe",
    quote: "The hands-on access to the 8x NVIDIA H100 cluster completely changed my understanding of LLM fine-tuning. Building 12 production capstones with LangGraph gave me the exact architecture experience required to clear the Adobe senior engineering defense.",
  },
  {
    name: "Sneha Roy",
    role: "Senior Data Scientist at Microsoft • ₹38 LPA",
    badge: "Alumni 2025",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    program: "Data Science & Advanced Analytics",
    location: "Park Street Cohort",
    beforeRole: "BI Analyst",
    beforeComp: "₹7.5 LPA",
    currentRole: "Senior Data Scientist",
    currentComp: "₹38.0 LPA",
    company: "Microsoft",
    quote: "Coming from a traditional software background, the mentorship from Dr. Arindam Sengupta and the Park Street offline labs were transformative. The dual-accredited diploma is recognized internationally and immediately validated my technical profile.",
  },
  {
    name: "David Chen",
    role: "MLOps Infrastructure Engineer at Goldman Sachs",
    badge: "Alumni 2026",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    program: "Cloud AI Infrastructure & DevOps",
    location: "Hybrid Cohort",
    beforeRole: "DevOps Engineer",
    beforeComp: "₹12.0 LPA",
    currentRole: "MLOps Infrastructure Engineer",
    currentComp: "₹42.0 LPA",
    company: "Goldman Sachs",
    quote: "Deploying autonomous swarms on local vLLM and TensorRT-LLM endpoints under realistic concurrency limits was unmatched. This wasn't shallow slide theory—it was real engineering with enterprise telemetry.",
  },
  {
    name: "Debayan Mukherjee",
    role: "AI Systems Engineer at Persistent Systems • ₹24 LPA",
    badge: "Alumni 2025",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    program: "Generative AI Engineering",
    location: "Kolkata Cohort",
    beforeRole: "Backend Developer",
    beforeComp: "₹6.5 LPA",
    currentRole: "AI Systems Engineer",
    currentComp: "₹24.0 LPA",
    company: "Persistent Systems",
    quote: "Building real RAG architectures and multi-agent workflows in the Park Street lab gave me the exact skills needed to clear the AI Systems interview.",
  },
  {
    name: "Ritwika Sengupta",
    role: "Machine Learning Engineer at Tiger Analytics • ₹19.5 LPA",
    badge: "Alumni 2025",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    program: "Machine Learning Specialization",
    location: "Hybrid Cohort",
    beforeRole: "Data Analyst",
    beforeComp: "₹5.2 LPA",
    currentRole: "Machine Learning Engineer",
    currentComp: "₹19.5 LPA",
    company: "Tiger Analytics",
    quote: "The 1-on-1 mentorship with Google and Microsoft engineers gave me confidence. The capstone project was the centerpiece of my portfolio.",
  },
];

