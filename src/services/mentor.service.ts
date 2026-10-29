import mongoose from "mongoose";
import { Mentor, MentorshipBooking, CreateMentorInput, UpdateMentorInput, CreateBookingInput } from "../types/mentor.js";
import { MentorModel, MentorshipBookingModel } from "../models/Mentor.model.js";
import { MENTORS } from "../data/seedData.js";

let inMemoryMentors: Mentor[] = [...MENTORS];
let cachedDbMentors: Mentor[] | null = null;
let mentorCacheExpiry = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

let inMemoryBookings: MentorshipBooking[] = [
  {
    id: "bk_101",
    mentorId: "anirban-das",
    mentorName: "Anirban Das",
    sessionType: "Video Call",
    date: "2026-10-30",
    timeSlot: "11:00 AM",
    message: "Portfolio review for GenAI capstone architecture.",
    studentName: "Hadi Khan",
    studentEmail: "student@innovacio.ai",
    studentPhone: "+91 9876543210",
    amount: 2000,
    status: "confirmed",
    createdAt: new Date().toISOString()
  }
];

function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export const mentorService = {
  async getAll(filters: { category?: string; search?: string; maxPrice?: number; mode?: string } = {}): Promise<Mentor[]> {
    const isUnfiltered =
      (!filters.category || filters.category === "all") &&
      (!filters.search || !filters.search.trim()) &&
      !filters.maxPrice &&
      !filters.mode;

    if (isUnfiltered && cachedDbMentors && Date.now() < mentorCacheExpiry) {
      return cachedDbMentors;
    }

    if (isDbConnected()) {
      const query: any = {};
      if (filters.maxPrice) {
        query.priceNum = { $lte: filters.maxPrice };
      }
      if (filters.mode) {
        query.modes = { $regex: new RegExp(filters.mode, "i") };
      }
      if (filters.search && filters.search.trim()) {
        const regex = { $regex: new RegExp(filters.search.trim(), "i") };
        query.$or = [{ name: regex }, { company: regex }, { role: regex }, { skills: regex }];
      }

      let docs = await MentorModel.find(query).lean();

      if (filters.category && filters.category !== "all") {
        const cat = filters.category.toLowerCase();
        docs = docs.filter((m) => {
          if (cat === "genai") return m.skills.some((s) => /Generative|LLM|RAG|LangChain/i.test(s));
          if (cat === "datascience") return m.skills.some((s) => /Data|Analytics|SQL/i.test(s));
          if (cat === "machine-learning") return m.skills.some((s) => /Machine|MLOps|Python/i.test(s));
          if (cat === "cybersecurity") return m.skills.some((s) => /Cyber|Security|SOC/i.test(s));
          if (cat === "cloud") return m.skills.some((s) => /Cloud|AWS|GCP|Kubernetes/i.test(s));
          if (cat === "business") return m.skills.some((s) => /Strategy|Product|Career/i.test(s));
          return true;
        });
      }

      const result = docs as unknown as Mentor[];
      if (isUnfiltered) {
        cachedDbMentors = result;
        mentorCacheExpiry = Date.now() + CACHE_TTL_MS;
      }
      return result;
    }

    // In-memory fallback
    let result = [...inMemoryMentors];
    if (filters.category && filters.category !== "all") {
      const cat = filters.category.toLowerCase();
      result = result.filter((m) => {
        if (cat === "genai") return m.skills.some((s) => /Generative|LLM|RAG|LangChain/i.test(s));
        if (cat === "datascience") return m.skills.some((s) => /Data|Analytics|SQL/i.test(s));
        if (cat === "machine-learning") return m.skills.some((s) => /Machine|MLOps|Python/i.test(s));
        if (cat === "cybersecurity") return m.skills.some((s) => /Cyber|Security|SOC/i.test(s));
        if (cat === "cloud") return m.skills.some((s) => /Cloud|AWS|GCP|Kubernetes/i.test(s));
        if (cat === "business") return m.skills.some((s) => /Strategy|Product|Career/i.test(s));
        return true;
      });
    }

    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.company.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q) ||
          m.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filters.maxPrice) {
      result = result.filter((m) => m.priceNum <= filters.maxPrice!);
    }

    if (filters.mode) {
      result = result.filter((m) =>
        m.modes.some((mode) => mode.toLowerCase().includes(filters.mode!.toLowerCase()))
      );
    }

    return result;
  },

  async getById(id: string): Promise<Mentor | undefined> {
    if (isDbConnected()) {
      const doc = await MentorModel.findOne({ id: { $regex: new RegExp(`^${id}$`, "i") } }).lean();
      if (doc) return doc as unknown as Mentor;
    }
    return inMemoryMentors.find((m) => m.id.toLowerCase() === id.toLowerCase());
  },

  async create(data: CreateMentorInput): Promise<Mentor> {
    const id =
      data.id ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const newMentor: Mentor = {
      id,
      name: data.name,
      role: data.role,
      company: data.company,
      avatar:
        data.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      rating: data.rating ?? 4.9,
      sessionsCount: data.sessionsCount || "10+ sessions",
      bio: data.bio || "Specialist in AI systems and mentoring.",
      skills: data.skills || ["AI", "Python"],
      experience: data.experience || "5+ Years",
      pricePerSession: data.pricePerSession || `₹${data.priceNum || 2000}`,
      priceNum: data.priceNum || 2000,
      badge: data.badge,
      availability: data.availability || "This Week",
      modes: data.modes || ["Video Call"],
      languages: data.languages || ["English"]
    };

    if (isDbConnected()) {
      await MentorModel.create(newMentor);
    }
    cachedDbMentors = null;
    inMemoryMentors.push(newMentor);
    return newMentor;
  },

  async update(id: string, data: UpdateMentorInput): Promise<Mentor | undefined> {
    if (isDbConnected()) {
      const doc = await MentorModel.findOneAndUpdate(
        { id: { $regex: new RegExp(`^${id}$`, "i") } },
        data,
        { returnDocument: "after" }
      ).lean();
      if (doc) {
        cachedDbMentors = null;
        return doc as unknown as Mentor;
      }
    }

    const mentor = inMemoryMentors.find((m) => m.id.toLowerCase() === id.toLowerCase());
    if (!mentor) return undefined;
    Object.assign(mentor, data);
    cachedDbMentors = null;
    return mentor;
  },

  async delete(id: string): Promise<boolean> {
    if (isDbConnected()) {
      const res = await MentorModel.deleteOne({ id: { $regex: new RegExp(`^${id}$`, "i") } });
      if (res.deletedCount > 0) {
        cachedDbMentors = null;
        return true;
      }
      return false;
    }

    const idx = inMemoryMentors.findIndex((m) => m.id.toLowerCase() === id.toLowerCase());
    if (idx === -1) return false;
    inMemoryMentors.splice(idx, 1);
    cachedDbMentors = null;
    return true;
  },

  async createBooking(data: CreateBookingInput): Promise<MentorshipBooking> {
    const mentor = await this.getById(data.mentorId);
    if (!mentor) {
      const err: any = new Error("Selected mentor does not exist.");
      err.statusCode = 404;
      err.code = "MENTOR_NOT_FOUND";
      throw err;
    }

    // Double-booking conflict check
    if (isDbConnected()) {
      const conflict = await MentorshipBookingModel.findOne({
        mentorId: mentor.id,
        date: data.date,
        timeSlot: data.timeSlot,
        status: { $ne: "cancelled" }
      }).lean();

      if (conflict) {
        const err: any = new Error(
          `The time slot ${data.timeSlot} on ${data.date} is already booked for ${mentor.name}. Please choose another slot.`
        );
        err.statusCode = 409;
        err.code = "SLOT_CONFLICT";
        throw err;
      }
    } else {
      const conflict = inMemoryBookings.find(
        (b) =>
          b.mentorId === mentor.id &&
          b.date === data.date &&
          b.timeSlot === data.timeSlot &&
          b.status !== "cancelled"
      );
      if (conflict) {
        const err: any = new Error(
          `The time slot ${data.timeSlot} on ${data.date} is already booked for ${mentor.name}. Please choose another slot.`
        );
        err.statusCode = 409;
        err.code = "SLOT_CONFLICT";
        throw err;
      }
    }

    const booking: MentorshipBooking = {
      id: `bk_${Date.now()}`,
      mentorId: mentor.id,
      mentorName: mentor.name,
      sessionType: data.sessionType || "Video Call",
      date: data.date,
      timeSlot: data.timeSlot,
      message: data.message,
      studentName: data.studentName.trim(),
      studentEmail: data.studentEmail.trim().toLowerCase(),
      studentPhone: data.studentPhone.trim(),
      amount: mentor.priceNum,
      status: "confirmed",
      createdAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      await MentorshipBookingModel.create(booking);
    }
    inMemoryBookings.push(booking);
    return booking;
  },

  async getBookings(): Promise<MentorshipBooking[]> {
    if (isDbConnected()) {
      const docs = await MentorshipBookingModel.find().sort({ createdAt: -1 }).lean();
      return docs as unknown as MentorshipBooking[];
    }
    return inMemoryBookings;
  }
};
