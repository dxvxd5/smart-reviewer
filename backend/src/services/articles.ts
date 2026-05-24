import { ArticleModel, toHistoryItem } from "../models/Article.js";
import type { AnalyzeResponse, HistoryItem } from "../types.js";
import { analyzeArticle } from "./gemini.js";
import type { SearchedArticle } from "./gnews.js";

const HISTORY_LIMIT = 50;

/**
 * Returns a cached analysis if we've seen the URL before, otherwise calls
 * Gemini, persists the article + analysis, and returns the fresh result.
 */
export async function analyzeOrCache(article: SearchedArticle): Promise<AnalyzeResponse> {
  const existing = await ArticleModel.findOne({ url: article.url });
  if (existing) {
    return { ...toHistoryItem(existing), cached: true };
  }

  const analysis = await analyzeArticle(article);
  const doc = await ArticleModel.create({
    url: article.url,
    title: article.title,
    description: article.description,
    source: article.source,
    publishedAt: article.publishedAt,
    image: article.image,
    summary: analysis.summary,
    sentiment: analysis.sentiment,
    sentimentScore: analysis.score,
    reasoning: analysis.reasoning,
  });

  return { ...toHistoryItem(doc), cached: false };
}

export async function listHistory(): Promise<HistoryItem[]> {
  const docs = await ArticleModel.find().sort({ createdAt: -1 }).limit(HISTORY_LIMIT);
  return docs.map(toHistoryItem);
}
