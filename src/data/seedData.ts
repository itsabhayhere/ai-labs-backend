export interface CourseModule {
  week: string;
  title: string;
  desc: string;
  lecturesCount?: number;
  hoursCount?: number;
}

export interface Course {
  id: string;
  slug: string;
  category: "genai" | "datascience" | "machine-learning" | "cybersecurity" | "cloud" | "business" | "fullstack";
  badge?: string;
  isMostPopular?: boolean;
  level: string;
  duration: string;
  format: string;
  title: string;
  shortDesc: string;
  fullDesc?: string;
  thumbnail: string;
  rating: number;
  reviewsCount: number;
  instructor: string;
  instructorRole: string;
  price: string;
  originalPrice: string;
  discount: string;
  saveAmount: string;
  emi: string;
  seatsLeft: number;
  isBestseller?: boolean;
  enrolledCount: string;
  startDate?: string;
  schedule?: string;
  highlights: string[];
  tools: string[];
  modules: CourseModule[];
  capstone?: string;
  whatYouWillLearn?: string[];
  prerequisites?: string[];
}

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
    id: "genai",
    slug: "generative-ai-engineering",
    category: "genai",
    badge: "Most Popular",
    isMostPopular: true,
    level: "Beginner to Advanced",
    duration: "12 Weeks (120+ Hours)",
    format: "Live Online & Offline",
    title: "Generative AI Engineering",
    shortDesc: "Build real-world GenAI applications with LLMs, RAG, AI Agents and production-ready systems. Learn from industry experts and work on hands-on projects.",
    fullDesc: "This comprehensive Generative AI Engineering program is designed for engineers, developers and tech professionals who want to master modern AI tools and build real-world applications. You'll learn LLMs, prompt engineering, RAG, fine-tuning, AI agents, and deployment on cloud platforms through hands-on projects and industry case studies.",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 1420,
    instructor: "Anirban Das",
    instructorRole: "AI Research Engineer at Google",
    price: "₹75,000",
    originalPrice: "₹95,000",
    discount: "21% OFF",
    saveAmount: "Save ₹20,000",
    emi: "EMI from ₹6,250/month",
    seatsLeft: 4,
    isBestseller: true,
    enrolledCount: "3,840+ Enrolled",
    startDate: "5 Nov 2026",
    schedule: "Sat & Sun, 10 AM – 1 PM (IST)",
    highlights: [
      "12 weeks | 120+ hours of learning",
      "Live classes + hands-on labs",
      "Real-world projects & portfolio",
      "1-on-1 mentorship sessions",
      "Career support & job assistance",
      "Certificate from Innovacio AI Labs"
    ],
    tools: ["LLM", "RAG", "AI Agents", "LangChain", "Pinecone", "Qdrant", "vLLM", "AWS"],
    whatYouWillLearn: [
      "Foundations of Generative AI & LLMs",
      "Vector Databases (Pinecone, Qdrant, FAISS)",
      "Prompt Engineering & Evaluation Techniques",
      "Building Production-ready AI Applications",
      "RAG (Retrieval Augmented Generation)",
      "Deployment on Cloud (AWS/GCP)",
      "Building AI Agents with LangChain & LangGraph",
      "Responsible AI & Safety",
      "Fine-tuning and Model Customization",
      "Real-world Projects & Hackathons"
    ],
    prerequisites: [
      "Basic programming knowledge (Python preferred)",
      "Interest in AI and building real-world applications",
      "Laptop (8GB+ RAM recommended)"
    ],
    modules: [
      {
        week: "Module 1",
        title: "Introduction to Generative AI & Prompt Architecture",
        desc: "Transformer self-attention mathematics, token economics, context window management, structured JSON outputs, and Chain-of-Thought prompting.",
        lecturesCount: 6,
        hoursCount: 8
      },
      {
        week: "Module 2",
        title: "Prompt Engineering & Evaluation Benchmarks",
        desc: "System prompts, dynamic few-shot learning, hallucination guardrails, and automated evaluation frameworks with Ragas and TruLens.",
        lecturesCount: 8,
        hoursCount: 10
      },
      {
        week: "Module 3",
        title: "LLMs, Model Architectures & Vector Databases",
        desc: "Deep dive into Llama 3, DeepSeek, Mistral. Vector search mechanics, cosine similarity, HNSW indexing, and hybrid dense/sparse search.",
        lecturesCount: 8,
        hoursCount: 10
      },
      {
        week: "Module 4",
        title: "Advanced Retrieval-Augmented Generation (Enterprise RAG)",
        desc: "Multi-modal RAG pipelines, contextual re-ranking with Cohere, query expansion, metadata filtering, and caching strategies.",
        lecturesCount: 10,
        hoursCount: 14
      },
      {
        week: "Module 5",
        title: "Autonomous AI Agents with LangGraph & CrewAI",
        desc: "Multi-agent coordination, tool calling, reflection loops, human-in-the-loop approvals, and stateful workflow graphs.",
        lecturesCount: 10,
        hoursCount: 14
      },
      {
        week: "Module 6",
        title: "Fine-Tuning, Low-Latency Serving & Cloud Deployment",
        desc: "Parameter-efficient fine-tuning (LoRA, QLoRA), low-latency serving on NVIDIA GPUs using vLLM, and Docker/Kubernetes production deployment.",
        lecturesCount: 8,
        hoursCount: 12
      }
    ],
    capstone: "Enterprise Multi-Agent Swarm with Local vLLM Inference & Hybrid RAG"
  },
  {
    id: "datascience",
    slug: "data-science-analytics",
    category: "datascience",
    badge: "Popular",
    isMostPopular: false,
    level: "Beginner to Advanced",
    duration: "16 Weeks",
    format: "Live Online & Offline",
    title: "Data Science & Analytics",
    shortDesc: "Master data analysis, visualization and machine learning. Learn SQL, Python, Power BI, and statistical modeling with real business data.",
    fullDesc: "Learn data science end-to-end: exploratory analysis, hypothesis testing, relational databases, predictive machine learning models, and executive dashboards in Power BI and Tableau.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 2150,
    instructor: "Rohan Kapoor",
    instructorRole: "Data Scientist at Amazon",
    price: "₹70,000",
    originalPrice: "₹90,000",
    discount: "22% OFF",
    saveAmount: "Save ₹20,000",
    emi: "EMI from ₹5,833/month",
    seatsLeft: 6,
    isBestseller: true,
    enrolledCount: "4,820+ Enrolled",
    startDate: "12 Nov 2026",
    schedule: "Sat & Sun, 2 PM – 5 PM (IST)",
    highlights: [
      "16 weeks of structured statistical & ML training",
      "5 real-world corporate analytics capstones",
      "Power BI & Tableau executive certification prep",
      "1-on-1 resume & career interview coaching"
    ],
    tools: ["Python", "SQL", "Power BI", "ML", "Pandas", "Scikit-Learn", "Tableau", "Snowflake"],
    whatYouWillLearn: [
      "Advanced SQL with Window Functions & Stored Procedures",
      "Statistical Inference, Hypothesis Testing & A/B Experiments",
      "Supervised & Unsupervised Machine Learning Algorithms",
      "Data Storytelling & Executive Visualizations in Power BI",
      "Predictive Analytics & Forecasting in Business Domains"
    ],
    modules: [
      { week: "Module 1", title: "Python for Data Science & Advanced SQL", desc: "Data cleaning, vectorization with NumPy, Pandas manipulation, relational schema design, and complex analytical SQL queries.", lecturesCount: 8, hoursCount: 12 },
      { week: "Module 2", title: "Statistical Analysis & A/B Testing", desc: "Probability distributions, central limit theorem, hypothesis testing, and business experimentation frameworks.", lecturesCount: 8, hoursCount: 12 },
      { week: "Module 3", title: "Machine Learning Foundations", desc: "Linear/logistic regression, decision trees, random forests, boosting algorithms, and cross-validation.", lecturesCount: 10, hoursCount: 16 },
      { week: "Module 4", title: "Business Intelligence & Big Data", desc: "Executive KPI dashboards in Power BI, data pipeline orchestration, and cloud data warehouses with Snowflake.", lecturesCount: 8, hoursCount: 12 }
    ]
  },
  {
    id: "machine-learning",
    slug: "machine-learning-specialization",
    category: "machine-learning",
    badge: "Core Engineering",
    isMostPopular: false,
    level: "Intermediate",
    duration: "14 Weeks",
    format: "Live Online & Offline",
    title: "Machine Learning Specialization",
    shortDesc: "From fundamentals to advanced ML techniques and real-world applications. Deploy scalable predictive architectures and deep learning models.",
    fullDesc: "Build rigorous mathematical intuition and implementation mastery in neural networks, gradient boosting, computer vision with CNNs, and ML pipeline automation with MLOps.",
    thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 1890,
    instructor: "Priya Mehta",
    instructorRole: "Senior ML Engineer at Microsoft",
    price: "₹70,000",
    originalPrice: "₹90,000",
    discount: "22% OFF",
    saveAmount: "Save ₹20,000",
    emi: "EMI from ₹5,833/month",
    seatsLeft: 5,
    enrolledCount: "2,940+ Enrolled",
    startDate: "18 Nov 2026",
    schedule: "Sat & Sun, 10 AM – 1 PM (IST)",
    highlights: [
      "Deep Learning with PyTorch on NVIDIA GPU cluster",
      "Computer Vision & NLP project implementations",
      "MLOps experiment tracking with MLflow & Weights & Biases",
      "End-to-end production deployment on AWS"
    ],
    tools: ["Python", "Deep Learning", "MLOps", "CV", "PyTorch", "XGBoost", "Docker", "MLflow"],
    modules: [
      { week: "Module 1", title: "Mathematical Foundations & Algorithmic ML", desc: "Linear algebra, gradient descent optimization, regularization, SVMs, and tree ensembles.", lecturesCount: 8, hoursCount: 12 },
      { week: "Module 2", title: "Deep Neural Networks with PyTorch", desc: "Backpropagation, custom training loops, convolutional neural networks, and transfer learning.", lecturesCount: 10, hoursCount: 16 },
      { week: "Module 3", title: "Sequence Modeling & Transformers", desc: "Attention mechanisms, recurrent architectures, tokenizers, and domain-adapted NLP.", lecturesCount: 8, hoursCount: 14 },
      { week: "Module 4", title: "MLOps & Scalable Model Serving", desc: "Containerization, FastAPI microservices, monitoring model drift, and CI/CD pipelines.", lecturesCount: 8, hoursCount: 12 }
    ]
  },
  {
    id: "cybersecurity",
    slug: "cybersecurity-ethical-hacking",
    category: "cybersecurity",
    badge: "Specialized Defense",
    isMostPopular: false,
    level: "Beginner to Advanced",
    duration: "14 Weeks",
    format: "Live Online & Offline",
    title: "Cybersecurity & Ethical Hacking",
    shortDesc: "Learn to protect systems and build secure AI solutions. Hands-on network penetration testing, web application security, and SOC operations.",
    fullDesc: "Comprehensive offensive and defensive cybersecurity training. Learn ethical hacking, cloud security configuration, reverse engineering, and securing AI models against adversarial prompt injections.",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 1190,
    instructor: "Kavya Nair",
    instructorRole: "Cybersecurity Expert at Palo Alto Networks",
    price: "₹65,000",
    originalPrice: "₹85,000",
    discount: "24% OFF",
    saveAmount: "Save ₹20,000",
    emi: "EMI from ₹5,416/month",
    seatsLeft: 7,
    enrolledCount: "2,190+ Enrolled",
    startDate: "15 Nov 2026",
    schedule: "Sat & Sun, 2 PM – 5 PM (IST)",
    highlights: [
      "Hands-on attack & defense cyber range with 40+ virtual machines",
      "Curriculum mapped to CEH and CompTIA Security+",
      "AI Security: defending LLMs against jailbreaks & data poisoning",
      "Incident response and SIEM threat hunting with Splunk"
    ],
    tools: ["Network Security", "Ethical Hacking", "SOC", "Kali Linux", "Wireshark", "Burp Suite", "Splunk"],
    modules: [
      { week: "Module 1", title: "Network Architecture & Packet Forensics", desc: "TCP/IP protocol suites, deep packet inspection, firewall configuration, and vulnerability scanning with Nmap.", lecturesCount: 8, hoursCount: 12 },
      { week: "Module 2", title: "Web App Penetration Testing (OWASP Top 10)", desc: "SQL injection, XSS, CSRF, broken authentication, and automated exploitation with Burp Suite.", lecturesCount: 10, hoursCount: 15 },
      { week: "Module 3", title: "SOC Operations & Threat Hunting", desc: "SIEM analysis with Splunk, log parsing, malware triage, and incident response playbooks.", lecturesCount: 8, hoursCount: 12 },
      { week: "Module 4", title: "AI Model Security & Guardrails", desc: "Adversarial attacks on neural networks, LLM jailbreak mitigation, and NeMo Guardrail implementation.", lecturesCount: 6, hoursCount: 10 }
    ]
  },
  {
    id: "cloud-ai",
    slug: "cloud-ai-infrastructure",
    category: "cloud",
    badge: "High Demand",
    isMostPopular: false,
    level: "Intermediate",
    duration: "12 Weeks",
    format: "Live Online & Offline",
    title: "Cloud AI Infrastructure",
    shortDesc: "Deploy and scale AI solutions on cloud platforms. Master Kubernetes, Docker containers, multi-cloud architectures, and high-performance GPU clusters.",
    fullDesc: "Learn cloud infrastructure engineered specifically for modern AI workloads: distributed GPU clusters, Kubernetes orchestration, autoscaling inference pipelines, and Terraform infrastructure-as-code.",
    thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 980,
    instructor: "Vikram Singh",
    instructorRole: "Cloud AI Architect at AWS",
    price: "₹65,000",
    originalPrice: "₹85,000",
    discount: "24% OFF",
    saveAmount: "Save ₹20,000",
    emi: "EMI from ₹5,416/month",
    seatsLeft: 5,
    enrolledCount: "1,750+ Enrolled",
    startDate: "22 Nov 2026",
    schedule: "Sat & Sun, 10 AM – 1 PM (IST)",
    highlights: [
      "Multi-Cloud deployment: AWS Bedrock, SageMaker, GCP Vertex AI",
      "Kubernetes cluster administration for distributed training",
      "GPU node provisioning, vLLM continuous batching, and Triton server",
      "Terraform & GitOps automation for AI enterprise infrastructure"
    ],
    tools: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Triton", "Helm"],
    modules: [
      { week: "Module 1", title: "Docker Containerization & Linux Internals", desc: "Building optimized GPU-accelerated container images, multi-stage builds, and CUDA drivers.", lecturesCount: 6, hoursCount: 10 },
      { week: "Module 2", title: "Kubernetes Orchestration for AI", desc: "Deployments, StatefulSets, GPU device plugins, horizontal pod autoscaling, and persistent volumes.", lecturesCount: 8, hoursCount: 14 },
      { week: "Module 3", title: "Inference Serving at Scale", desc: "Triton Inference Server, vLLM continuous batching, latency benchmarking, and load balancing.", lecturesCount: 8, hoursCount: 12 },
      { week: "Module 4", title: "Infrastructure-as-Code with Terraform", desc: "Automated provisioning of GPU compute clusters, secure VPC networks, and observability with Prometheus.", lecturesCount: 6, hoursCount: 10 }
    ]
  },
  {
    id: "business-ai",
    slug: "ai-for-business-professionals",
    category: "business",
    badge: "Executive",
    isMostPopular: false,
    level: "Beginner",
    duration: "8 Weeks",
    format: "Live Online & Offline",
    title: "AI for Business Professionals",
    shortDesc: "Apply AI in real business use cases and drive innovation. Strategic frameworks for managers, executives, and product leaders.",
    fullDesc: "Demystify modern AI for decision-makers. Learn how to identify high-ROI AI initiatives, evaluate vendor solutions, guide engineering teams, implement compliance, and automate workflows.",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 760,
    instructor: "Sneha Iyer",
    instructorRole: "AI Product Manager at Meta",
    price: "₹45,000",
    originalPrice: "₹60,000",
    discount: "25% OFF",
    saveAmount: "Save ₹15,000",
    emi: "EMI from ₹3,750/month",
    seatsLeft: 8,
    enrolledCount: "1,220+ Enrolled",
    startDate: "25 Nov 2026",
    schedule: "Saturday, 10 AM – 2 PM (IST)",
    highlights: [
      "Executive AI strategy, vendor evaluation, and ROI calculation",
      "Hands-on with no-code/low-code AI automation tools",
      "Case studies from Fintech, Healthcare, E-Commerce, and SaaS",
      "Exclusive networking with cohort leaders and alumni"
    ],
    tools: ["Business Strategy", "AI Tools", "Case Studies", "Zapier", "Make", "Claude", "OpenAI"],
    modules: [
      { week: "Module 1", title: "AI Landscape & Strategic Opportunity Mapping", desc: "Generative AI vs predictive AI, capability boundaries, cost analysis, and identifying business bottlenecks.", lecturesCount: 6, hoursCount: 8 },
      { week: "Module 2", title: "Workflow Automation with Modern AI", desc: "Building internal AI copilots, customer support agents, and document analysis pipelines without coding.", lecturesCount: 6, hoursCount: 8 },
      { week: "Module 3", title: "AI Product Management & Team Leadership", desc: "Scoping AI requirements, evaluating data feasibility, managing technical debt, and ethical AI governance.", lecturesCount: 6, hoursCount: 8 },
      { week: "Module 4", title: "Enterprise Implementation Capstone", desc: "Developing a board-ready AI roadmap, budget projection, vendor evaluation matrix, and risk mitigation plan.", lecturesCount: 6, hoursCount: 8 }
    ]
  },
  {
    id: "ai-agents",
    slug: "ai-agents-automation",
    category: "genai",
    badge: "Trending",
    isMostPopular: false,
    level: "Intermediate",
    duration: "10 Weeks",
    format: "Live Online & Offline",
    title: "AI Agents & Automation",
    shortDesc: "Build autonomous agents and workflow automations for real-world use. Multi-agent state machines, tool integration, and reflection loops.",
    fullDesc: "Learn how to build, test, and deploy production-ready AI agents using LangGraph, CrewAI, and AutoGen. Connect agents to APIs, databases, and enterprise software to automate end-to-end knowledge work.",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 840,
    instructor: "Dr. Arindam Sengupta",
    instructorRole: "Lead AI Scientist, Ex-Google Brain",
    price: "₹60,000",
    originalPrice: "₹80,000",
    discount: "25% OFF",
    saveAmount: "Save ₹20,000",
    emi: "EMI from ₹5,000/month",
    seatsLeft: 4,
    enrolledCount: "1,540+ Enrolled",
    startDate: "20 Nov 2026",
    schedule: "Sat & Sun, 2 PM – 5 PM (IST)",
    highlights: [
      "Stateful agent graphs with LangGraph and SQLite checkpoints",
      "Multi-agent role assignment & consensus mechanisms",
      "Enterprise tool execution with sandbox security",
      "Autonomous web navigation and automated testing agents"
    ],
    tools: ["LangGraph", "CrewAI", "n8n", "RAG", "FastAPI", "Docker", "Playwright"],
    modules: [
      { week: "Module 1", title: "Agent Architectures & ReAct Patterns", desc: "Reasoning and acting loops, tool definition schemas, prompt optimization, and memory management.", lecturesCount: 6, hoursCount: 10 },
      { week: "Module 2", title: "LangGraph State Machines", desc: "Nodes, edges, conditional routing, cyclic graphs, persistence, and human-in-the-loop review gates.", lecturesCount: 8, hoursCount: 12 },
      { week: "Module 3", title: "Multi-Agent Swarm Orchestration", desc: "Collaborative agents with AutoGen & CrewAI, task delegation, critic agents, and self-healing pipelines.", lecturesCount: 8, hoursCount: 14 },
      { week: "Module 4", title: "Production Agent Deployment & Telemetry", desc: "Streaming agent responses, webhook integration, latency optimizations, and agent telemetry with LangSmith.", lecturesCount: 6, hoursCount: 10 }
    ]
  },
  {
    id: "fullstack-ai",
    slug: "full-stack-ai-development",
    category: "fullstack",
    badge: "Comprehensive",
    isMostPopular: false,
    level: "Intermediate",
    duration: "16 Weeks",
    format: "Live Online & Offline",
    title: "Full-Stack AI Application Development",
    shortDesc: "Build and deploy end-to-end AI applications with modern frameworks. React, Next.js, FastAPI, vector databases, and scalable cloud architectures.",
    fullDesc: "Become a complete AI engineer capable of architecting both the modern frontend user experience and the high-throughput AI backend. Learn Next.js App Router, streaming UI, FastAPI, asynchronous job queues, and real-time LLM caching.",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 1120,
    instructor: "Anirban Das",
    instructorRole: "AI Research Engineer at Google",
    price: "₹80,000",
    originalPrice: "₹1,05,000",
    discount: "24% OFF",
    saveAmount: "Save ₹25,000",
    emi: "EMI from ₹6,666/month",
    seatsLeft: 6,
    enrolledCount: "1,980+ Enrolled",
    startDate: "28 Nov 2026",
    schedule: "Sat & Sun, 10 AM – 1 PM (IST)",
    highlights: [
      "End-to-end production AI application development",
      "Streaming UI components with Next.js & Vercel AI SDK",
      "Asynchronous worker queues with Celery and Redis",
      "Complete portfolio of 4 full-stack deployed applications"
    ],
    tools: ["Next.js", "React", "Node.js", "Python", "FastAPI", "PostgreSQL", "Redis", "Docker"],
    modules: [
      { week: "Module 1", title: "Modern Frontend for AI with Next.js", desc: "React Server Components, streaming responses, SSE, Vercel AI SDK, and chat interface design.", lecturesCount: 8, hoursCount: 14 },
      { week: "Module 2", title: "High-Performance Python Backends with FastAPI", desc: "Asynchronous endpoints, dependency injection, Pydantic validation, JWT authentication, and background tasks.", lecturesCount: 8, hoursCount: 14 },
      { week: "Module 3", title: "Database Systems & Vector Retrieval", desc: "Relational persistence in PostgreSQL with Prisma/SQLAlchemy, and pgvector semantic search integration.", lecturesCount: 8, hoursCount: 12 },
      { week: "Module 4", title: "Cloud Deployment, CI/CD & Scaling", desc: "Docker Compose, automated GitHub Actions pipelines, Redis caching, and deployment on AWS/Vercel.", lecturesCount: 8, hoursCount: 12 }
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

