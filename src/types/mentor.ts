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

export interface MentorshipBooking {
  id: string;
  mentorId: string;
  mentorName: string;
  sessionType: string;
  date: string;
  timeSlot: string;
  message?: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  amount: number;
  status: "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export type CreateMentorInput = Omit<Mentor, "id"> & { id?: string };
export type UpdateMentorInput = Partial<CreateMentorInput>;

export interface CreateBookingInput {
  mentorId: string;
  sessionType: string;
  date: string;
  timeSlot: string;
  message?: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
}
