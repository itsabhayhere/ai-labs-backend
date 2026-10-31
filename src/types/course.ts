export interface CourseDuration {
  total: string;
  breakdown: string;
}

export interface CurriculumAdvancedPhaseModule {
  timeframe: string;
  module: string;
  coreTopics: string[];
  assignmentTypes: string[];
}

export interface CurriculumAiIntegrationPhase {
  topics: string[];
}

export interface CurriculumAdvancedPlusPhaseModule {
  moduleNumber: number;
  moduleName: string;
  relevantTopics: string[];
}

export interface CourseCurriculum {
  advancedPhase: CurriculumAdvancedPhaseModule[];
  aiIntegrationPhase: CurriculumAiIntegrationPhase;
  advancedPlusPhase: CurriculumAdvancedPlusPhaseModule[];
}

export interface ProjectCheckpoint {
  checkpoint: string;
  description: string;
}

export interface CareerSupportItem {
  service: string;
  details: string;
}

export interface SuccessMetric {
  metric: string;
  description: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  positioning: string;
  audience: string;
  duration: CourseDuration;
  coreStack: string[];
  curriculum: CourseCurriculum;
  projectCheckpoints: ProjectCheckpoint[];
  careerSupportBundle: CareerSupportItem[];
  successMetrics: SuccessMetric[];
  createdAt?: string;
  updatedAt?: string;
}

export type CreateCourseInput = Omit<Course, "id" | "slug"> & {
  id?: string;
  slug?: string;
};

export type UpdateCourseInput = Partial<CreateCourseInput>;

export interface CourseFilterQuery {
  search?: string;
  page?: number;
  limit?: number;
  sort?: "title-asc" | "title-desc" | "newest" | "oldest";
}
