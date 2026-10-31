import { StudentUser } from "./student.js";

export interface AdminStudentFilterQuery {
  page?: number;
  limit?: number;
  search?: string;
  batch?: string;
  campus?: string;
  role?: string;
  courseId?: string;
  sort?: "name-asc" | "name-desc" | "date-asc" | "date-desc";
}

export interface AdminCourseFilterQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  level?: string;
  sort?: "price-asc" | "price-desc" | "rating" | "popular" | "date-asc" | "date-desc";
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface AdminUpdateStudentInput {
  name?: string;
  role?: "student" | "alumni" | "admin";
  batch?: string;
  campus?: string;
  avatar?: string;
}

export interface AdminDashboardStats {
  studentsCount: number;
  coursesCount: number;
  mentorsCount: number;
  enrollmentsCount: number;
  coursesByCategory: Record<string, number>;
  studentsByRole: Record<string, number>;
  recentStudents: Omit<StudentUser, "password">[];
}

