import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { env } from "../config/env.js";
import { ApiError } from "../middleware/error.js";
import type { Analysis } from "../types.js";
import type { SearchedArticle } from "./gnews.js";

const MODEL = "gemini-2.5-flash";
const TIMEOUT_MS = 20000;

const AnalysisSchema = z.object({
  summary: z.string().min(1),
  sentiment: z.enum(["positive", "neutral", "negative"]),
  score: z.number().min(-1).max(1),
  reasoning: z.string().nullable().optional(),
});

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

function buildPrompt(article: SearchedArticle): string {
  return [
    "You are a concise news analyst. Read the article below and return STRICT JSON only.",
    "",
    "Required JSON shape:",
    "{",
    '  "summary": "6-8 sentence neutral summary of the article",',
    '  "sentiment": "positive" | "neutral" | "negative",',
    '  "score": number in [-1, 1] (negative = bearish/critical, positive = bullish/optimistic, 0 = neutral),',
    '  "reasoning": "one sentence explaining the sentiment label"',
    "}",
    "",
    "Rules:",
    "- Output ONLY the JSON object. No prose, no markdown fences.",
    "- Summary must be neutral and factual, not editorialized.",
    "- Base the sentiment on the article's framing of its primary subject, not your personal view.",
    "",
    `Title: ${article.title}`,
    `Source: ${article.source}`,
    article.description ? `Description: ${article.description}` : "",
    article.content ? `Body: ${article.content}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function stripFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export async function analyzeArticle(article: SearchedArticle): Promise<Analysis> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: { responseMimeType: "application/json" },
  });

  let text: string;
  try {
    const result = await Promise.race([
      model.generateContent(buildPrompt(article)),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("gemini-timeout")), TIMEOUT_MS),
      ),
    ]);
    text = result.response.text();
  } catch (err) {
    if (err instanceof Error && err.message === "gemini-timeout") {
      throw ApiError.upstream("Gemini request timed out");
    }
    throw ApiError.upstream("Gemini call failed");
  }

  let json: unknown;
  try {
    json = JSON.parse(stripFences(text));
  } catch {
    throw ApiError.upstream("Gemini returned non-JSON output");
  }

  const parsed = AnalysisSchema.safeParse(json);
  if (!parsed.success) {
    throw ApiError.upstream("Gemini returned an unexpected analysis shape");
  }

  return {
    summary: parsed.data.summary,
    sentiment: parsed.data.sentiment,
    score: parsed.data.score,
    reasoning: parsed.data.reasoning ?? null,
  };
}
