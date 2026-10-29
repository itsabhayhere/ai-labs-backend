export interface FAQItem {
  category: "admissions" | "curriculum" | "placements" | "campus" | "all";
  question: string;
  answer: string;
}

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
