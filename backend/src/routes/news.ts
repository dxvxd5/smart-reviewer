import { Router } from "express";
import { z } from "zod";
import { ApiError } from "../middleware/error.js";
import { searchNews } from "../services/gnews.js";
import type { Article } from "../types.js";

export const newsRouter: Router = Router();

const QuerySchema = z.object({
  q: z
    .string()
    .transform((s) =>
      s
        .normalize("NFKC")
        // Strip control chars, zero-width chars, and BOM.
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x1f\x7f-\x9f\u200B-\u200F\u2028-\u202F\uFEFF]/g, "")
        // Collapse runs of whitespace into a single space.
        .replace(/\s+/g, " ")
        .trim(),
    )
    .pipe(z.string().min(2, "q must be at least 2 characters").max(200, "q is too long")),
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
