// Uses the default in-memory store — resets on restart and not shared across
// instances. Swap to `rate-limit-redis` if the backend scales beyond one process.
import rateLimit from "express-rate-limit";
import { ApiError } from "./error.js";

/**
 * Per-IP sliding window limiter for the analyze endpoint.
 * 10 requests per minute — protects the Gemini free-tier budget.
 */
export const analyzeLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(ApiError.rateLimit("Too many analyze requests — try again in a minute"));
  },
});

/**
 * Per-IP sliding window limiter for the news search endpoint.
 * 30 requests per minute — guards the GNews 100 req/day cap.
 */
export const searchLimiter = rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(ApiError.rateLimit("Too many search requests — try again in a minute"));
  },
});
