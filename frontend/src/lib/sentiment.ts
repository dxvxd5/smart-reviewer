// sentiment.ts — semantic palette + helpers for sentiment values.
// Sentiment is NEVER tweakable; it has a consistent meaning across the app.

import type { Sentiment } from "../types";

interface SentimentTokens {
  ink: string;
  soft: string;
  label: string;
}

export const SENT: Record<Sentiment, SentimentTokens> = {
  positive: { ink: "var(--pos)", soft: "var(--pos-soft)", label: "Positive" },
  neutral: { ink: "var(--neu)", soft: "var(--neu-soft)", label: "Neutral" },
  negative: { ink: "var(--neg)", soft: "var(--neg-soft)", label: "Negative" },
};

export function sentColor(s: Sentiment): string {
  return SENT[s].ink;
}

export function sentSoft(s: Sentiment): string {
  return SENT[s].soft;
}

export function sentLabel(s: Sentiment): string {
  return SENT[s].label;
}
