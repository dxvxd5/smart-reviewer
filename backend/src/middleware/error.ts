import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export type ApiErrorCode = "bad-request" | "not-found" | "rate-limit" | "upstream" | "internal";

export class ApiError extends Error {
  status: number;
  code: ApiErrorCode;

  constructor(status: number, code: ApiErrorCode, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }

  static badRequest(message: string) {
    return new ApiError(400, "bad-request", message);
  }
  static notFound(message: string) {
    return new ApiError(404, "not-found", message);
  }
  static rateLimit(message: string) {
    return new ApiError(429, "rate-limit", message);
  }
  static upstream(message: string) {
    return new ApiError(502, "upstream", message);
  }
  static internal(message: string) {
    return new ApiError(500, "internal", message);
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "bad-request",
        message: "Invalid request",
        details: err.flatten().fieldErrors,
      },
    });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({
    error: { code: "internal", message: "Internal server error" },
  });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: { code: "not-found", message: "Route not found" } });
}
