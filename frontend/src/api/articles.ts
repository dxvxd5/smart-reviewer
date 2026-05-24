// articles.ts — analyze articles and read persisted history.

import { apiClient } from "./client";
import type { Article, AnalyzeResponse, HistoryItem } from "../types";

interface HistoryResponse {
  items: HistoryItem[];
}

/**
 * Trigger (or fetch the cached) analysis for an article.
 * The backend dedupes by URL: if the URL was already analyzed, the response
 * has `cached: true` and `originallyAnalyzedAt` set to the first run.
 */
export async function analyzeArticle(
  article: Article,
  signal?: AbortSignal,
): Promise<AnalyzeResponse> {
  const { data } = await apiClient.post<AnalyzeResponse>(
    "/api/articles/analyze",
    { article },
    { signal },
  );
  return data;
}

/** List previously analyzed articles, newest first. */
export async function getHistory(signal?: AbortSignal): Promise<HistoryItem[]> {
  const { data } = await apiClient.get<HistoryResponse>("/api/articles", {
    signal,
  });
  return data.items;
}
