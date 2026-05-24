import { SENT } from "../../lib/sentiment";
import type { Sentiment } from "../../types";
import styles from "./SentimentPill.module.css";
import { cx } from "../../lib/cx";

type Variant = "soft" | "outline" | "dot";
type Size = "sm" | "lg";

interface SentimentPillProps {
  sentiment: Sentiment;
  score: number;
  variant?: Variant;
  size?: Size;
}

const VARIANT_CLASS: Record<Variant, string> = {
  soft: styles.soft,
  outline: styles.outline,
  dot: styles.variantDot,
};

const SIZE_CLASS: Record<Size, string> = {
  sm: styles.sizeSm,
  lg: styles.sizeLg,
};

const SENTIMENT_CLASS: Record<Sentiment, string> = {
  positive: styles.positive,
  neutral: styles.neutral,
  negative: styles.negative,
};

export function SentimentPill({
  sentiment,
  score,
  variant = "soft",
  size = "sm",
}: SentimentPillProps) {
  const classes = cx(
    styles.pill,
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    SENTIMENT_CLASS[sentiment],
  );

  return (
    <span className={classes}>
      <span className={styles.dot} aria-hidden="true" />
      <span>{SENT[sentiment].label}</span>
      <span className={styles.score}>
        {score > 0 ? "+" : ""}
        {score.toFixed(2)}
      </span>
    </span>
  );
}
