import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";
import type { Analysis, HistoryItem } from "../types.js";

const ArticleSchema = new Schema(
  {
    url: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: null },
    source: { type: String, required: true },
    publishedAt: { type: String, required: true },
    image: { type: String, default: null },

    summary: { type: String, required: true },
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"],
      required: true,
    },
    sentimentScore: { type: Number, required: true, min: -1, max: 1 },
    reasoning: { type: String, default: null },
  },
  { timestamps: true },
);

export type ArticleDocument = HydratedDocument<InferSchemaType<typeof ArticleSchema>>;

export const ArticleModel = model("Article", ArticleSchema);

export function toHistoryItem(doc: ArticleDocument): HistoryItem {
  const analysis: Analysis = {
    summary: doc.summary,
    sentiment: doc.sentiment,
    score: doc.sentimentScore,
    reasoning: doc.reasoning,
  };
  return {
    id: doc.id,
    article: {
      url: doc.url,
      title: doc.title,
      description: doc.description ?? null,
      source: doc.source,
      publishedAt: doc.publishedAt,
      image: doc.image ?? null,
    },
    analysis,
    cached: true,
    originallyAnalyzedAt: doc.createdAt.toISOString(),
  };
}
