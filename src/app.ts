import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/index.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { correlationMiddleware, sanitizeMongoInput } from "./middlewares/security.js";

const app = express();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

// Cross-Origin Resource Sharing with explicit origin allowlist
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        config.cors.origins.includes(origin) ||
        !config.isProduction ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked request from origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
    credentials: true
  })
);

// Body Parsers with safe maximum payload limits
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Correlation ID Tracking
app.use(correlationMiddleware);

// NoSQL Operator Injection Sanitizer
app.use(sanitizeMongoInput);

// Root Welcome
app.get("/", (_req, res) => {
  res.json({
    success: true,
    service: "Innovacio AI Labs Backend API",
    version: "2.0.0",
    documentation: "/api",
    health: "/api/health"
  });
});

// API Routes
app.use("/api", routes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `Endpoint not found: ${req.method} ${req.originalUrl}`
    }
  });
});

// Centralized Express 5 Error Handler
app.use(errorHandler);

export default app;
