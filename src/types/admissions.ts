export interface CounselingInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  mode: "offline" | "online" | "hybrid";
  experience: "student" | "working_professional" | "transitioning";
  status: "pending" | "contacted" | "admitted";
  createdAt: string;
}

export interface BrochureDownloadRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  createdAt: string;
}

export interface CampusVisitBooking {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  programInterest: string;
  campusLocation: string;
  status: "scheduled" | "visited" | "cancelled";
  createdAt: string;
}
