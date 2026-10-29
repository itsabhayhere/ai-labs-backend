import { emailService } from "./email.service.js";
import mongoose from "mongoose";
import {
  CounselingInquiry,
  BrochureDownloadRequest,
  CampusVisitBooking
} from "../types/admissions.js";
import {
  CounselingModel,
  BrochureModel,
  CampusVisitModel
} from "../models/Admissions.model.js";

let inMemoryCounselings: CounselingInquiry[] = [];
let inMemoryBrochures: BrochureDownloadRequest[] = [];
let inMemoryCampusVisits: CampusVisitBooking[] = [];

function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export const admissionsService = {
  async createCounseling(data: {
    name: string;
    email: string;
    phone: string;
    program: string;
    mode?: "offline" | "online" | "hybrid";
    experience?: "student" | "working_professional" | "transitioning";
  }): Promise<CounselingInquiry> {
    const inquiry: CounselingInquiry = {
      id: `counsel_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      program: data.program,
      mode: data.mode || "offline",
      experience: data.experience || "student",
      status: "pending",
      createdAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      await CounselingModel.create(inquiry);
    }
    inMemoryCounselings.push(inquiry);

    // Send lead notification to admin (jayesh@innovaciotechnologies.com)
    emailService.sendConsultationLeadNotification({
      name: data.name,
      phone: data.phone,
      email: data.email,
      program: data.program,
      mode: data.mode,
      notes: (data as any).notes
    }).catch(err => console.warn("⚠️ Consultation lead notification dispatch error:", err));

    return inquiry;
  },

  async getCounselings(): Promise<CounselingInquiry[]> {
    if (isDbConnected()) {
      const docs = await CounselingModel.find().sort({ createdAt: -1 }).lean();
      if (docs.length > 0) return docs as unknown as CounselingInquiry[];
    }
    return inMemoryCounselings;
  },

  async createBrochureRequest(data: {
    name: string;
    email: string;
    phone: string;
    course: string;
  }): Promise<BrochureDownloadRequest> {
    const request: BrochureDownloadRequest = {
      id: `brochure_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      course: data.course || "genai",
      createdAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      await BrochureModel.create(request);
    }
    inMemoryBrochures.push(request);
    return request;
  },

  async getBrochureRequests(): Promise<BrochureDownloadRequest[]> {
    if (isDbConnected()) {
      const docs = await BrochureModel.find().sort({ createdAt: -1 }).lean();
      if (docs.length > 0) return docs as unknown as BrochureDownloadRequest[];
    }
    return inMemoryBrochures;
  },

  async createCampusVisit(data: {
    name: string;
    phone: string;
    email: string;
    date: string;
    time: string;
    programInterest: string;
  }): Promise<CampusVisitBooking> {
    const visit: CampusVisitBooking = {
      id: `visit_${Date.now()}`,
      name: data.name,
      phone: data.phone,
      email: data.email,
      date: data.date,
      time: data.time,
      programInterest: data.programInterest,
      campusLocation: "Park Street Campus, Kolkata",
      status: "scheduled",
      createdAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      await CampusVisitModel.create(visit);
    }
    inMemoryCampusVisits.push(visit);
    return visit;
  },

  async getCampusVisits(): Promise<CampusVisitBooking[]> {
    if (isDbConnected()) {
      const docs = await CampusVisitModel.find().sort({ createdAt: -1 }).lean();
      if (docs.length > 0) return docs as unknown as CampusVisitBooking[];
    }
    return inMemoryCampusVisits;
  }
};
