// API DTOs returned by this backend. Frontend mirrors these in its own types.ts.

export type Sentiment = "positive" | "neutral" | "negative";

export interface Article {
  url: string;
  title: string;
  description: string | null;
  source: string;
  publishedAt: string;
  image: string | null;
}

export interface Analysis {
  summary: string;
  sentiment: Sentiment;
  /** Signed sentiment score in [-1, 1]. */
  score: number;
  reasoning?: string | null;
}

export interface AnalyzeResponse {
  article: Article;
  analysis: Analysis;
  cached: boolean;
  originallyAnalyzedAt: string;
}

export interface HistoryItem extends AnalyzeResponse {
  id: string;
}
