import type { Analysis, Article } from "../../types";
import { Favicon } from "../Favicon/Favicon";
import { SentimentPill } from "../SentimentPill/SentimentPill";
import { Skeleton } from "../Skeleton/Skeleton";
import { Spinner } from "../Spinner/Spinner";
import { domainFromUrl } from "../../lib/url";
import { relativeTime } from "../../lib/relativeTime";
import styles from "./ArticleCard.module.css";
import { cx } from "../../lib/cx";

export type ArticleCardState = "idle" | "analyzing" | "analyzed" | "cached" | "error";

export type ArticleErrorKind = "rate-limit" | "network" | "timeout";

const ERROR_COPY: Record<ArticleErrorKind, { title: string; body: string }> = {
  "rate-limit": {
    title: "AI service is busy",
    body: "Hit a temporary rate limit. Try again in a few seconds.",
  },
  network: {
    title: "Can't reach the AI",
    body: "Looks like a network blip. Check your connection and retry.",
  },
  timeout: {
    title: "Took too long",
    body: "The model didn't respond in time. This sometimes happens — try again.",
  },
};

export interface ArticleCardProps {
  article: Article;
  state?: ArticleCardState;
  analysis?: Analysis;
  error?: ArticleErrorKind;
  cachedFrom?: { date: string };
  onAnalyze?: () => void;
  onRetry?: () => void;
  onOpenCached?: () => void;
  pillVariant?: "soft" | "outline" | "dot";
}

export function ArticleCard({
  article,
  state = "idle",
  analysis,
  error,
  cachedFrom,
  onAnalyze,
  onRetry,
  onOpenCached,
  pillVariant = "soft",
}: ArticleCardProps) {
  const analyzed = state === "analyzed" || state === "cached";
  const errCopy = state === "error" ? ERROR_COPY[error ?? "network"] : null;
  const domain = domainFromUrl(article.url);

  const rootCls = cx(styles.root, analyzed && styles.analyzed);

  const ruleCls = cx(
    styles.rule,
    analyzed && analysis && analysis.sentiment === "positive" && styles.rulePositive,
    analyzed && analysis && analysis.sentiment === "neutral" && styles.ruleNeutral,
    analyzed && analysis && analysis.sentiment === "negative" && styles.ruleNegative,
  );

  return (
    <article className={rootCls}>
      {analyzed && <div className={ruleCls} aria-hidden="true" />}

      {!analyzed && (
        <div
          className={styles.thumb}
          style={article.image ? { backgroundImage: `url(${article.image})` } : undefined}
          aria-hidden="true"
        />
      )}

      <div className={styles.body}>
        <div className={styles.meta}>
          <Favicon domain={domain} size={13} />
          <span className={styles.source}>{article.source}</span>
          <span aria-hidden="true">·</span>
          <span className={styles.ago}>{relativeTime(article.publishedAt)}</span>

          {state === "cached" && (
            <button
              type="button"
              className={styles.cached}
              onClick={onOpenCached}
              aria-label="Open the saved analysis in your history"
            >
              <span aria-hidden="true">⚡</span>
              Instant — already in your history
              <span aria-hidden="true">↗</span>
            </button>
          )}
        </div>

        <h3 className={styles.title}>{article.title}</h3>

        {state === "analyzing" && (
          <div className={styles.loading} aria-busy="true" aria-live="polite">
            <div className={styles.loadingStatus}>
              <Spinner size={13} />
              <span>Reading the article… asking the AI… scoring sentiment…</span>
            </div>
            <Skeleton h={11} style={{ marginBottom: 6 }} />
            <Skeleton h={11} w="92%" style={{ marginBottom: 6 }} />
            <Skeleton h={11} w="78%" />
          </div>
        )}

        {state === "error" && errCopy && (
          <div className={styles.error} role="alert">
            <span className={styles.errorMark} aria-hidden="true">
              !
            </span>
            <div className={styles.errorBody}>
              <div className={styles.errorTitle}>{errCopy.title}</div>
              <div className={styles.errorSub}>{errCopy.body}</div>
            </div>
          </div>
        )}

        {analyzed && analysis && (
          <div className={styles.summaryBlock}>
            <div className={styles.summaryLabel} aria-hidden="true">
              <span className={styles.summaryMark}>✦</span> AI summary
            </div>
            <p className={styles.summary}>{analysis.summary}</p>
          </div>
        )}

        {state === "idle" && article.description && (
          <p className={styles.snippet}>{article.description}</p>
        )}

        {analyzed && analysis ? (
          <div className={cx(styles.actions, styles.actionsAnalyzed)}>
            <SentimentPill
              sentiment={analysis.sentiment}
              score={analysis.score}
              variant={pillVariant}
            />
            <span className={styles.actionsNote}>
              {state === "cached"
                ? cachedFrom
                  ? `Originally analyzed ${cachedFrom.date}`
                  : "Loaded from your history"
                : "Summarized just now by AI"}
            </span>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.extLink}
            >
              Read original <span aria-hidden="true">→</span>
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </div>
        ) : state === "error" ? (
          <div className={styles.actions}>
            <button type="button" className={styles.primary} onClick={onRetry}>
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />
              </svg>
              Try again
            </button>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cx(styles.extLink, styles.extLinkMuted)}
            >
              Read original <span aria-hidden="true">↗</span>
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </div>
        ) : (
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primary}
              onClick={onAnalyze}
              disabled={state === "analyzing"}
            >
              {state === "analyzing" ? (
                <>
                  <Spinner size={11} color="currentColor" />
                  Analyzing…
                </>
              ) : (
                <>
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M5 3l14 9-14 9V3z" />
                  </svg>
                  Analyze
                </>
              )}
            </button>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cx(styles.extLink, styles.extLinkMuted)}
            >
              Read original <span aria-hidden="true">↗</span>
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
