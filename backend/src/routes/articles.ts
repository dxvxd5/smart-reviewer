import { Router } from "express";
import { z } from "zod";
import { ApiError } from "../middleware/error.js";
import { analyzeOrCache, listHistory } from "../services/articles.js";
import type { SearchedArticle } from "../services/gnews.js";

export const articlesRouter: Router = Router();

const ArticleSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1),
  description: z.string().nullable(),
  source: z.string().min(1),
  publishedAt: z.string().min(1),
  image: z.string().url().nullable(),
});

const AnalyzeBodySchema = z.object({
  article: ArticleSchema,
});

articlesRouter.post("/analyze", async (req, res, next) => {
  const parsed = AnalyzeBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return next(ApiError.badRequest(parsed.error.issues[0]?.message ?? "invalid body"));
  }

  try {
    // Frontend doesn't carry the article body, so `content` is null here.
    // Gemini falls back to title + description on first analyze.
    const searched: SearchedArticle = { ...parsed.data.article, content: null };
    const result = await analyzeOrCache(searched);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

articlesRouter.get("/", async (_req, res, next) => {
  try {
    const items = await listHistory();
    res.json({ items });
  } catch (err) {
    next(err);
  }
});
