import { useEffect, useRef, useState } from "react";
import type { HistoryItem } from "../../types";
import { Favicon } from "../Favicon/Favicon";
import { SENT } from "../../lib/sentiment";
import { domainFromUrl } from "../../lib/url";
import { relativeTime } from "../../lib/relativeTime";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import styles from "./Drawer.module.css";
import { cx } from "../../lib/cx";

export interface DrawerProps {
  item: HistoryItem | null;
  onClose: () => void;
  isMobile?: boolean;
}

const EXIT_MS = 240;

export function Drawer({ item, onClose, isMobile = false }: DrawerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [displayItem, setDisplayItem] = useState<HistoryItem | null>(item);
  const [closing, setClosing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync open: render the new item immediately when one arrives.
  if (item && item !== displayItem) {
    setDisplayItem(item);
    setClosing(false);
    setCopied(false);
  }

  // Sync close: when the item goes away, start the exit timer once.
  if (!item && displayItem && !closing) {
    setClosing(true);
  }

  useEffect(() => {
    if (!closing) return;
    const t = window.setTimeout(() => {
      setDisplayItem(null);
      setClosing(false);
    }, EXIT_MS);
    return () => window.clearTimeout(t);
  }, [closing]);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  useFocusTrap(dialogRef, !!item);
  useEscapeKey(onClose, !!item);

  if (!displayItem) return null;

  const { article, analysis } = displayItem;
  const s = SENT[analysis.sentiment];
  const titleId = `drawer-title-${displayItem.id}`;
  const date = relativeTime(displayItem.originallyAnalyzedAt);
  const domain = domainFromUrl(article.url);

  const sentCls =
    analysis.sentiment === "positive"
      ? styles.sentimentPositive
      : analysis.sentiment === "neutral"
        ? styles.sentimentNeutral
        : styles.sentimentNegative;

  const ruleCls =
    analysis.sentiment === "positive"
      ? styles.rulePositive
      : analysis.sentiment === "neutral"
        ? styles.ruleNeutral
        : styles.ruleNegative;

  const drawerCls = cx(
    styles.drawer,
    isMobile ? styles.sheet : styles.side,
    closing && (isMobile ? styles.sheetExit : styles.sideExit),
  );
  const backdropCls = cx(styles.backdrop, closing && styles.backdropExit);
  const scoreSign = analysis.score > 0 ? "+" : "";

  return (
    <>
      <div className={backdropCls} onClick={onClose} aria-hidden="true" />
      <aside
        ref={dialogRef}
        className={drawerCls}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={cx(styles.rule, ruleCls)} aria-hidden="true" />

        {isMobile && (
          <div className={styles.grabber} aria-hidden="true">
            <span />
          </div>
        )}

        <header className={styles.header}>
          <Favicon domain={domain} size={16} />
          <span className={styles.source}>{article.source}</span>
          <span className={styles.sep} aria-hidden="true">
            ·
          </span>
          <span className={styles.date}>{date}</span>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close detail panel"
          >
            ×
          </button>
        </header>

        {article.image && (
          <div
            className={styles.hero}
            style={{ backgroundImage: `url(${article.image})` }}
            aria-hidden="true"
          />
        )}

        <div className={styles.content}>
          <h2 id={titleId} className={styles.title}>
            {article.title}
          </h2>

          <div className={cx(styles.sentiment, sentCls)}>
            <div className={styles.sentimentLabel}>SENTIMENT</div>
            <div className={styles.sentimentValue}>{s.label}</div>
            <div className={styles.sentimentScore}>
              {scoreSign}
              {analysis.score.toFixed(2)}
            </div>
          </div>

          <section>
            <div className={styles.sectionLabel}>SUMMARY</div>
            <p className={styles.summary}>{analysis.summary}</p>
          </section>

          {analysis.reasoning && (
            <section>
              <div className={styles.sectionLabel}>WHY THIS SCORE</div>
              <p className={styles.reasoning}>{analysis.reasoning}</p>
            </section>
          )}
        </div>

        <footer className={styles.footer}>
          <a href={article.url} target="_blank" rel="noopener noreferrer" className={styles.cta}>
            Read original <span aria-hidden="true">↗</span>
            <span className="sr-only">(opens in new tab)</span>
          </a>
          <button
            type="button"
            className={styles.secondary}
            onClick={async () => {
              try {
                await navigator.clipboard?.writeText(analysis.summary);
                setCopied(true);
              } catch {
                // Clipboard unavailable (insecure context / denied) — silently no-op.
              }
            }}
            aria-live="polite"
          >
            {copied ? "Copied!" : "Copy summary"}
          </button>
        </footer>
      </aside>
    </>
  );
}
