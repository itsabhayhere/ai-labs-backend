import { StudentDashboardData } from "../types/student.js";

export const INITIAL_STUDENT_DASHBOARD: StudentDashboardData = {
  user: {
    id: "std_001",
    name: "Hadi Khan",
    email: "student@innovacio.ai",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    role: "student",
    batch: "Nov 2026 Cohort",
    campus: "Park Street, Kolkata & Virtual Labs",
    createdAt: "2026-10-01T00:00:00.000Z"
  },
  stats: {
    coursesEnrolled: 3,
    hoursLearned: 54,
    labsCompleted: 18,
    streakDays: 14,
    cohortRank: "Top 5%"
  },
  enrolledCourses: [
    {
      id: "genai",
      title: "Generative AI Engineering",
      slug: "generative-ai-engineering",
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      week: "Week 4 of 12",
      progress: 38,
      status: "in-progress",
      nextClass: "Saturday, 10:00 AM (Live Lab)"
    },
    {
      id: "datascience",
      title: "Data Science & Analytics",
      slug: "data-science-analytics",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      week: "Week 3 of 16",
      progress: 22,
      status: "in-progress",
      nextClass: "Sunday, 2:00 PM (SQL & BI Studio)"
    },
    {
      id: "cybersecurity",
      title: "Cybersecurity & Ethical Hacking",
      slug: "cybersecurity-ethical-hacking",
      thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
      week: "Week 2 of 14",
      progress: 10,
      status: "in-progress",
      nextClass: "Next Tuesday, 7:00 PM (Pen-testing Lab)"
    }
  ],
  upcomingClasses: [
    {
      id: "class_01",
      courseTitle: "Generative AI Engineering",
      topic: "Module 4: Enterprise RAG Pipelines & Cohere Re-Ranking",
      instructor: "Anirban Das (Ex-Google Brain)",
      date: "Saturday, Nov 1, 2026",
      time: "10:00 AM – 1:00 PM IST",
      meetingUrl: "https://meet.google.com/inno-ai-cohort"
    },
    {
      id: "class_02",
      courseTitle: "Data Science & Analytics",
      topic: "Module 3: Statistical Hypothesis Testing in Python",
      instructor: "Rohan Kapoor (Amazon)",
      date: "Sunday, Nov 2, 2026",
      time: "2:00 PM – 5:00 PM IST",
      meetingUrl: "https://meet.google.com/inno-ds-cohort"
    }
  ],
  recentAnnouncements: [
    {
      id: "ann_01",
      title: "🚀 NVIDIA H100 GPU Cluster credentials provisioned for all enrolled students",
      date: "2 hours ago",
      author: "Innovacio Infrastructure Desk",
      urgent: true
    },
    {
      id: "ann_02",
      title: "1-on-1 Mentorship booking slots open for weekend review with Anirban & Priya",
      date: "Yesterday",
      author: "Admissions & Mentorship Cell",
      urgent: false
    }
  ]
};
