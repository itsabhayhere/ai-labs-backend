import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "../config/index.js";
import { CourseModel } from "../models/Course.model.js";
import { MentorModel } from "../models/Mentor.model.js";
import { FaqModel, TestimonialModel } from "../models/Content.model.js";
import { DiscussionModel } from "../models/Discussion.model.js";
import { StudentUserModel } from "../models/Student.model.js";
import { COURSES, MENTORS, FAQS, TESTIMONIALS } from "../data/seedData.js";
import { INITIAL_DISCUSSIONS } from "../data/discussionsData.js";
import { INITIAL_STUDENT_DASHBOARD } from "../data/studentData.js";

async function runSeed() {
  console.log("🌱 Connecting to MongoDB Atlas:", config.mongoUri.replace(/:[^:]*@/, ":****@"));
  await mongoose.connect(config.mongoUri);
  console.log("✓ Connected to DB:", mongoose.connection.name);

  // 1. Courses
  let coursesUpserted = 0;
  for (const course of COURSES) {
    await CourseModel.findOneAndUpdate({ id: course.id }, course, { upsert: true, new: true });
    coursesUpserted++;
  }
  console.log(`✓ Upserted ${coursesUpserted} Courses into MongoDB`);

  // 2. Mentors
  let mentorsUpserted = 0;
  for (const mentor of MENTORS) {
    await MentorModel.findOneAndUpdate({ id: mentor.id }, mentor, { upsert: true, new: true });
    mentorsUpserted++;
  }
  console.log(`✓ Upserted ${mentorsUpserted} Mentors into MongoDB`);

  // 3. FAQs
  let faqsUpserted = 0;
  for (const faq of FAQS) {
    await FaqModel.findOneAndUpdate({ question: faq.question }, faq, { upsert: true, new: true });
    faqsUpserted++;
  }
  console.log(`✓ Upserted ${faqsUpserted} FAQs into MongoDB`);

  // 4. Testimonials
  let testimonialsUpserted = 0;
  for (const testimonial of TESTIMONIALS) {
    await TestimonialModel.findOneAndUpdate({ name: testimonial.name }, testimonial, { upsert: true, new: true });
    testimonialsUpserted++;
  }
  console.log(`✓ Upserted ${testimonialsUpserted} Testimonials into MongoDB`);

  // 5. Discussions
  let discussionsUpserted = 0;
  for (const disc of INITIAL_DISCUSSIONS) {
    await DiscussionModel.findOneAndUpdate({ id: disc.id }, disc, { upsert: true, new: true });
    discussionsUpserted++;
  }
  console.log(`✓ Upserted ${discussionsUpserted} Discussions into MongoDB`);

  // 6. Default Student User
  const hashedPassword = await bcrypt.hash("Student@2026", 10);
  await StudentUserModel.findOneAndUpdate(
    { email: INITIAL_STUDENT_DASHBOARD.user.email },
    {
      ...INITIAL_STUDENT_DASHBOARD.user,
      password: hashedPassword,
      enrolledCourses: INITIAL_STUDENT_DASHBOARD.enrolledCourses,
    },
    { upsert: true, new: true }
  );
  console.log(`✓ Seeded default student account: ${INITIAL_STUDENT_DASHBOARD.user.email}`);

  // Summary counts
  const counts = {
    courses: await CourseModel.countDocuments(),
    mentors: await MentorModel.countDocuments(),
    faqs: await FaqModel.countDocuments(),
    testimonials: await TestimonialModel.countDocuments(),
    discussions: await DiscussionModel.countDocuments(),
    students: await StudentUserModel.countDocuments(),
  };

  console.log("\n📊 Final MongoDB Collections Count:", counts);
  await mongoose.disconnect();
  console.log("✓ Seeding complete. Disconnected from MongoDB.");
}

runSeed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
