import axios, { AxiosError } from "axios";
import { z } from "zod";
import { env } from "../config/env.js";
import { ApiError } from "../middleware/error.js";
import type { Article } from "../types.js";

/**
 * GNews article enriched with the truncated body text.
 * `content` is kept server-side only and fed to Gemini; it is not part of
 * the wire-facing `Article` DTO.
 */
export interface SearchedArticle extends Article {
  content: string | null;
}

const GNewsArticleSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  url: z.string().url(),
  image: z.string().url().nullable().optional(),
  publishedAt: z.string(),
  source: z.object({ name: z.string() }),
});

const GNewsResponseSchema = z.object({
  totalArticles: z.number().optional(),
  articles: z.array(GNewsArticleSchema),
});

const BASE_URL = "https://gnews.io/api/v4/search";
const DEFAULT_MAX = 10;
const TIMEOUT_MS = 8000;

export async function searchNews(query: string): Promise<SearchedArticle[]> {
  let data: unknown;
  try {
    const res = await axios.get<unknown>(BASE_URL, {
      params: { q: query, lang: "en", max: DEFAULT_MAX, apikey: env.GNEWS_API_KEY },
      timeout: TIMEOUT_MS,
    });
    data = res.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.code === "ECONNABORTED") throw ApiError.upstream("GNews request timed out");
      if (err.response?.status === 429) throw ApiError.rateLimit("GNews rate limit reached");
      if (err.response) throw ApiError.upstream(`GNews returned ${err.response.status}`);
    }
    throw ApiError.upstream("GNews network error");
  }

  const parsed = GNewsResponseSchema.safeParse(data);
  if (!parsed.success) {
    throw ApiError.upstream("GNews returned an unexpected response shape");
  }

  return parsed.data.articles.map((a) => ({
    url: a.url,
    title: a.title,
    description: a.description ?? null,
    source: a.source.name,
    publishedAt: a.publishedAt,
    image: a.image ?? null,
    content: a.content ?? null,
  }));
}
