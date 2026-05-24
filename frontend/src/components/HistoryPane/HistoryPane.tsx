import type { HistoryItem, Sentiment } from "../../types";
import { Favicon } from "../Favicon/Favicon";
import { SentimentPill } from "../SentimentPill/SentimentPill";
import { SENT } from "../../lib/sentiment";
import { domainFromUrl } from "../../lib/url";
import { relativeTime } from "../../lib/relativeTime";
import styles from "./HistoryPane.module.css";
import { cx } from "../../lib/cx";

export type HistoryFilter = "all" | Sentiment;

export interface HistoryCounts {
  all: number;
  positive: number;
  neutral: number;
  negative: number;
}

interface FilterDef {
  k: HistoryFilter;
  label: string;
  color?: "pos" | "neu" | "neg";
}

const FILTERS: FilterDef[] = [
  { k: "all", label: "All" },
  { k: "positive", label: "Positive", color: "pos" },
  { k: "neutral", label: "Neutral", color: "neu" },
  { k: "negative", label: "Negative", color: "neg" },
];

export interface HistoryPaneProps {
  history: HistoryItem[];
  totalCount: number;
  counts: HistoryCounts;
  filter: HistoryFilter;
  onFilter: (f: HistoryFilter) => void;
  onSelect: (item: HistoryItem) => void;
  density?: "comfortable" | "compact";
  pillVariant?: "soft" | "outline" | "dot";
  isMobile?: boolean;
  onSwitchToSearch?: () => void;
  headingId?: string;
}

export function HistoryPane({
  history,
  totalCount,
  counts,
  filter,
  onFilter,
  onSelect,
  density = "comfortable",
  pillVariant = "soft",
  isMobile = false,
  onSwitchToSearch,
  headingId,
}: HistoryPaneProps) {
  if (totalCount === 0) {
    return (
      <div className={styles.root}>
        <div className={styles.sectionHead}>
          <h2 id={headingId} className={styles.sectionTitle}>
            Your history
          </h2>
        </div>
        <div className={styles.empty}>
          <div className={styles.emptyIcon} aria-hidden="true">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
            >
              <path d="M3 3h18v18H3z" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>Nothing analyzed yet</h3>
          <p className={styles.emptySub}>
            Search for a story and click <strong>Analyze</strong> — it'll save here with its summary
            and sentiment so you can come back to it.
          </p>
          {isMobile && (
            <button type="button" className={styles.emptyCta} onClick={onSwitchToSearch}>
              Search news <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
        <FootnoteCache />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.sectionHead}>
        <h2 id={headingId} className={styles.sectionTitle}>
          Your history
        </h2>
        <span className={styles.sectionMeta}>{totalCount} articles</span>
      </div>

      <div className={styles.chips} role="group" aria-label="Filter by sentiment">
        {FILTERS.map((f) => {
          const active = filter === f.k;
          const colorCls =
            f.color === "pos"
              ? styles.chipPos
              : f.color === "neu"
                ? styles.chipNeu
                : f.color === "neg"
                  ? styles.chipNeg
                  : "";
          const cls = cx(styles.chip, active && styles.chipActive, colorCls);
          return (
            <button
              key={f.k}
              type="button"
              onClick={() => onFilter(f.k)}
              aria-pressed={active}
              className={cls}
            >
              {f.label}
              <span className={styles.chipCount}>{counts[f.k]}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.table} role="table" aria-label="Analyzed articles">
        <div className={styles.thead} role="row">
          <span role="columnheader">Article</span>
          <span role="columnheader">Sentiment</span>
          <span role="columnheader" className={styles.theadRight}>
            Date
          </span>
        </div>

        {history.length === 0 ? (
          <div className={styles.filterEmpty}>
            <p>
              No articles match this filter.{" "}
              <button type="button" className={styles.linkBtn} onClick={() => onFilter("all")}>
                Show all
              </button>
            </p>
          </div>
        ) : (
          history.map((h) => {
            const date = relativeTime(h.originallyAnalyzedAt);
            const fresh = date === "Just now";
            const domain = domainFromUrl(h.article.url);
            const rowCls = cx(styles.row, density === "compact" && styles.rowCompact);
            const scoreSign = h.analysis.score > 0 ? "+" : "";
            return (
              <button
                key={h.id}
                type="button"
                role="row"
                onClick={() => onSelect(h)}
                className={rowCls}
                aria-label={`${h.article.title}. ${
                  SENT[h.analysis.sentiment].label
                }, score ${scoreSign}${h.analysis.score.toFixed(2)}. ${date}.`}
              >
                <div className={styles.rowMain} role="cell">
                  <div className={styles.rowTitle}>{h.article.title}</div>
                  <div className={styles.rowMeta}>
                    <Favicon domain={domain} size={10} />
                    <span>{h.article.source}</span>
                    {fresh && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className={styles.rowFresh}>Just analyzed</span>
                      </>
                    )}
                  </div>
                </div>
                <div role="cell">
                  <SentimentPill
                    sentiment={h.analysis.sentiment}
                    score={h.analysis.score}
                    variant={pillVariant}
                  />
                </div>
                <div className={styles.rowDate} role="cell">
                  {date}
                </div>
              </button>
            );
          })
        )}
      </div>

      <FootnoteCache />
    </div>
  );
}

function FootnoteCache() {
  return (
    <div className={styles.foot}>
      <span>Articles you've already analyzed return instantly — no new AI call</span>
    </div>
  );
}
