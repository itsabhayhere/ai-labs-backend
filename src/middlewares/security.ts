import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

/**
 * Middleware that attaches a unique correlation ID to every incoming request.
 */
export const correlationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const correlationId = (req.headers["x-request-id"] as string) || crypto.randomUUID();
  req.correlationId = correlationId;
  res.setHeader("X-Request-Id", correlationId);
  next();
};

/**
 * Sanitizes an object recursively to ensure no MongoDB operator keys ($ or .) are present.
 */
function containsMongoOperators(obj: any): boolean {
  if (!obj || typeof obj !== "object") return false;

  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      return true;
    }
    if (typeof obj[key] === "object" && containsMongoOperators(obj[key])) {
      return true;
    }
  }
  return false;
}

export const sanitizeMongoInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (containsMongoOperators(req.body) || containsMongoOperators(req.query)) {
    res.status(400).json({
      success: false,
      error: {
        code: "INVALID_INPUT",
        message: "Request contains disallowed operators or characters."
      }
    });
    return;
  }
  next();
};
