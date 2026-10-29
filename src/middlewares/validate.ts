import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

interface ValidationTargets {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validate = (schemas: ValidationTargets) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        const parsed = (await schemas.query.parseAsync(req.query)) as any;
        // In Express 5, req.query is a getter, so we mutate in-place
        for (const key of Object.keys(req.query)) {
          delete (req.query as any)[key];
        }
        Object.assign(req.query, parsed);
      }
      if (schemas.params) {
        const parsed = (await schemas.params.parseAsync(req.params)) as any;
        Object.assign(req.params, parsed);
      }
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        const details = err.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message
        }));

        res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request payload. Please verify the submitted data.",
            details
          }
        });
        return;
      }
      next(err);
    }
  };
};
