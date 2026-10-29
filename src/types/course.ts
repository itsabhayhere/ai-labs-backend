export interface CourseModule {
  week: string;
  title: string;
  desc: string;
  lecturesCount?: number;
  hoursCount?: number;
}

export type CourseCategory =
  | "genai"
  | "datascience"
  | "machine-learning"
  | "cybersecurity"
  | "cloud"
  | "business"
  | "fullstack";

export interface Course {
  id: string;
  slug: string;
  category: CourseCategory;
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
  createdAt?: string;
  updatedAt?: string;
}

export type CreateCourseInput = Omit<Course, "id"> & { id?: string };
export type UpdateCourseInput = Partial<CreateCourseInput>;

export interface CourseFilterQuery {
  category?: string;
  level?: string;
  search?: string;
  popular?: string;
  sort?: "price-asc" | "price-desc" | "rating" | "popular";
}