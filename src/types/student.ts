export interface StudentUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role: "student" | "alumni" | "admin";
  batch: string;
  campus: string;
  createdAt: string;
  enrolledCourses?: StudentDashboardCourse[];
}

export interface StudentDashboardCourse {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  week: string;
  progress: number;
  completedLessons?: string[];
  status: "in-progress" | "completed";
  nextClass?: string;
}

export interface StudentDashboardData {
  user: Omit<StudentUser, "password">;
  stats: {
    coursesEnrolled: number;
    hoursLearned: number;
    labsCompleted: number;
    streakDays: number;
    cohortRank: string;
  };
  enrolledCourses: StudentDashboardCourse[];
  upcomingClasses: Array<{
    id: string;
    courseTitle: string;
    topic: string;
    instructor: string;
    time: string;
    date: string;
    meetingUrl: string;
  }>;
  recentAnnouncements: Array<{
    id: string;
    title: string;
    date: string;
    author: string;
    urgent?: boolean;
  }>;
}
