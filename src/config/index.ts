import dotenv from "dotenv";
dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const mongoUri =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/inno_ai_labs_db";

const jwtSecret = process.env.JWT_SECRET || (isProduction ? "" : "dev_jwt_secret_innovacio_ai_labs_32chars_min_2026");
if (isProduction && (!jwtSecret || jwtSecret.length < 32)) {
  throw new Error("FATAL: JWT_SECRET must be configured with at least 32 characters in production mode.");
}

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
  : [
      frontendUrl,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3001",
      "http://localhost:3002",
      "http://127.0.0.1:3002"
    ];

const resendApiKey = process.env.RESEND_API_KEY || "";
const resendFromEmail = process.env.RESEND_FROM_EMAIL || "Innovacio AI Labs <onboarding@resend.dev>";

const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
const smtpSecure = process.env.SMTP_SECURE === "true";
const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";
const smtpFrom = process.env.SMTP_FROM || "no-reply@innovaciotech.com";

export const config = {
  port,
  nodeEnv,
  isProduction,
  mongoUri,
  jwt: {
    secret: jwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  },
  cors: {
    origins: corsOrigins
  },
  seedDemoData: process.env.SEED_DEMO_DATA === "true" || (!isProduction && process.env.SEED_DEMO_DATA !== "false"),
  email: {
    resendApiKey,
    fromEmail: resendFromEmail,
    smtp: {
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      user: smtpUser,
      pass: smtpPass,
      from: smtpFrom
    }
  }
};
