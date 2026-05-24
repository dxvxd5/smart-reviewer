// types.ts — shared API DTOs.
// These mirror the backend response shapes. The backend is the source of truth
// (Zod-validated); we duplicate here rather than maintain a shared workspace.

export type Sentiment = "positive" | "neutral" | "negative";

/** A news article as returned by the news search endpoint. */
export interface Article {
  /** Canonical URL — stable id across searches & history. */
  url: string;
  title: string;
  description: string | null;
  source: string;
  /** ISO-8601 publication timestamp. */
  publishedAt: string;
  /** Optional thumbnail. */
  image: string | null;
}

/** The GenAI output for a single article. */
export interface Analysis {
  summary: string;
  sentiment: Sentiment;
  /** Confidence score in [0, 1]. */
  score: number;
}

/** Response from POST /api/articles/analyze. */
export interface AnalyzeResponse {
  article: Article;
  analysis: Analysis;
  /** True if this is a cache hit (article was previously analyzed). */
  cached: boolean;
  /** ISO-8601 timestamp of the original analysis run. */
  originallyAnalyzedAt: string;
}

/** A row in the persisted history list. */
export interface HistoryItem extends AnalyzeResponse {
  /** Mongo document id. */
  id: string;
}
