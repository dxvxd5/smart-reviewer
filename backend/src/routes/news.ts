import { Router } from "express";
import { z } from "zod";
import { ApiError } from "../middleware/error.js";
import { searchNews } from "../services/gnews.js";
import type { Article } from "../types.js";

export const newsRouter: Router = Router();

const QuerySchema = z.object({
  q: z.string().trim().min(2, "q must be at least 2 characters"),
});

newsRouter.get("/search", async (req, res, next) => {
  const parsed = QuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return next(ApiError.badRequest(parsed.error.issues[0]?.message ?? "invalid query"));
  }

  try {
    const results = await searchNews(parsed.data.q);
    // Strip server-only `content` before returning to the client.
    const articles: Article[] = results.map(({ content: _content, ...a }) => a);
    res.json({ articles });
  } catch (err) {
    next(err);
  }
});
