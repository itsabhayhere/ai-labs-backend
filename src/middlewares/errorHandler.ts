import type { Request, Response, NextFunction } from "express";
import { config } from "../config/index.js";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any[];
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const correlationId = req.correlationId || "unknown";

  // Standard error code mapping
  const errorCode =
    err.code ||
    (statusCode === 400
      ? "BAD_REQUEST"
      : statusCode === 401
      ? "UNAUTHORIZED"
      : statusCode === 403
      ? "FORBIDDEN"
      : statusCode === 404
      ? "NOT_FOUND"
      : statusCode === 409
      ? "CONFLICT"
      : statusCode === 422
      ? "UNPROCESSABLE_ENTITY"
      : statusCode === 429
      ? "RATE_LIMIT_EXCEEDED"
      : "INTERNAL_SERVER_ERROR");

  // Log error server-side with correlation ID
  console.error(
    `[Error][${correlationId}] ${req.method} ${req.originalUrl} - ${statusCode} (${errorCode}): ${err.message}`
  );
  if (!config.isProduction && err.stack) {
    console.error(err.stack);
  }

  // Safe message in production
  const safeMessage =
    config.isProduction && statusCode === 500
      ? "An unexpected internal error occurred. Please contact support or try again later."
      : err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: safeMessage,
      ...(err.details ? { details: err.details } : {}),
      correlationId: !config.isProduction ? correlationId : undefined
    }
  });
};
