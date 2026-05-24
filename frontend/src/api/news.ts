// news.ts — search the news index via the backend proxy.

import { apiClient } from "./client";
import type { Article } from "../types";

interface SearchResponse {
  articles: Article[];
}

/** Search news for the given query. Returns an array of articles. */
export async function searchNews(query: string, signal?: AbortSignal): Promise<Article[]> {
  const { data } = await apiClient.get<SearchResponse>("/api/news/search", {
    params: { q: query },
    signal,
  });
  return data.articles;
}
