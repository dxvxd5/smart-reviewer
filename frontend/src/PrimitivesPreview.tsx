// PrimitivesPreview — TEMPORARY visual gallery of step-3 & step-4 components.
// Remove this file (and its import in main.tsx) before the App.tsx port.

import { useState } from "react";

import { ArticleCard } from "./components/ArticleCard/ArticleCard";
import { Drawer } from "./components/Drawer/Drawer";
import { EmptyState } from "./components/EmptyState/EmptyState";
import { Favicon } from "./components/Favicon/Favicon";
import { Header } from "./components/Header/Header";
import { HistoryPane, type HistoryFilter } from "./components/HistoryPane/HistoryPane";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { SentimentPill } from "./components/SentimentPill/SentimentPill";
import { Skeleton } from "./components/Skeleton/Skeleton";
import { Spinner } from "./components/Spinner/Spinner";
import { TabBar, type TabKey } from "./components/TabBar/TabBar";
import { Toast, type ToastData } from "./components/Toast/Toast";
import type { Article, HistoryItem } from "./types";

const section: React.CSSProperties = {
  padding: "var(--sp-5)",
  borderTop: "1px solid var(--rule)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--sp-3)",
};

const row: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--sp-4)",
  flexWrap: "wrap",
};

const label: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--ink3)",
  fontWeight: 500,
};

const sampleArticle: Article = {
  url: "https://www.nytimes.com/2026/05/24/technology/ai-regulation-eu.html",
  title: "EU lawmakers reach tentative deal on second wave of AI safety rules",
  description:
    "Negotiators agreed on stricter pre-deployment audits for general-purpose models, with phased enforcement starting in 2027 and a carve-out for academic research.",
  source: "The New York Times",
  publishedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  image: null,
};

const sampleHistory: HistoryItem[] = [
  {
    id: "h1",
    article: {
      ...sampleArticle,
      title: "Markets rally as inflation cools to 18-month low",
      source: "Reuters",
      url: "https://www.reuters.com/markets/inflation-cools-2026-05-23/",
    },
    analysis: {
      summary:
        "Headline CPI came in below consensus, lifting equities broadly. Analysts cite shelter and energy as the main drivers.",
      sentiment: "positive",
      score: 0.71,
      reasoning:
        "Coverage emphasizes broad gains and improved outlook; defensive sectors lag only modestly.",
    },
    cached: false,
    originallyAnalyzedAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  },
  {
    id: "h2",
    article: {
      ...sampleArticle,
      title: "Central bank holds rates steady, signals patience",
      source: "Bloomberg",
      url: "https://www.bloomberg.com/news/articles/2026-05-22/rates-hold",
    },
    analysis: {
      summary:
        "Policy statement reiterated a data-dependent stance with no near-term cuts telegraphed.",
      sentiment: "neutral",
      score: 0.04,
    },
    cached: true,
    originallyAnalyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "h3",
    article: {
      ...sampleArticle,
      title: "Major outage takes payments network offline for hours",
      source: "BBC",
      url: "https://www.bbc.com/news/business/outage-2026-05-21",
    },
    analysis: {
      summary:
        "Merchants reported failed transactions across multiple regions; the operator has not yet identified a root cause.",
      sentiment: "negative",
      score: -0.58,
      reasoning: "Heavy use of words like 'failure', 'outage', and 'disruption' across coverage.",
    },
    cached: false,
    originallyAnalyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
];

const historyCounts = {
  all: sampleHistory.length,
  positive: sampleHistory.filter((h) => h.analysis.sentiment === "positive").length,
  neutral: sampleHistory.filter((h) => h.analysis.sentiment === "neutral").length,
  negative: sampleHistory.filter((h) => h.analysis.sentiment === "negative").length,
};

export function PrimitivesPreview() {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const [selected, setSelected] = useState<HistoryItem | null>(null);
  const [tab, setTab] = useState<TabKey>("search");

  const filteredHistory =
    filter === "all" ? sampleHistory : sampleHistory.filter((h) => h.analysis.sentiment === filter);

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        fontFamily: "var(--sans)",
        paddingBottom: 120,
      }}
    >
      <div style={{ padding: "var(--sp-6)" }}>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontSize: 32,
            color: "var(--ink)",
            marginBottom: "var(--sp-2)",
          }}
        >
          Smart Reviewer — Component preview
        </h1>
        <p style={{ color: "var(--ink2)" }}>
          Temporary preview of step 3 (primitives) and step 4 (composites).
        </p>
      </div>

      <section style={section}>
        <div style={label}>Spinner</div>
        <div style={row}>
          <Spinner />
          <Spinner size={20} />
          <Spinner size={28} color="var(--accent)" />
        </div>
      </section>

      <section style={section}>
        <div style={label}>Skeleton</div>
        <div style={{ ...row, flexDirection: "column", alignItems: "stretch" }}>
          <Skeleton h={14} />
          <Skeleton w="60%" h={14} />
          <Skeleton w={120} h={40} />
        </div>
      </section>

      <section style={section}>
        <div style={label}>Favicon</div>
        <div style={row}>
          <Favicon domain="nytimes.com" />
          <Favicon domain="bbc.com" size={20} />
          <Favicon domain="theverge.com" size={28} />
        </div>
      </section>

      <section style={section}>
        <div style={label}>SentimentPill — soft (default)</div>
        <div style={row}>
          <SentimentPill sentiment="positive" score={0.82} />
          <SentimentPill sentiment="neutral" score={0.05} />
          <SentimentPill sentiment="negative" score={-0.64} />
          <SentimentPill sentiment="positive" score={0.82} size="lg" />
        </div>
        <div style={label}>SentimentPill — outline</div>
        <div style={row}>
          <SentimentPill sentiment="positive" score={0.82} variant="outline" />
          <SentimentPill sentiment="neutral" score={0.05} variant="outline" />
          <SentimentPill sentiment="negative" score={-0.64} variant="outline" />
        </div>
        <div style={label}>SentimentPill — dot</div>
        <div style={row}>
          <SentimentPill sentiment="positive" score={0.82} variant="dot" />
          <SentimentPill sentiment="neutral" score={0.05} variant="dot" />
          <SentimentPill sentiment="negative" score={-0.64} variant="dot" />
        </div>
      </section>

      <section style={section}>
        <div style={label}>EmptyState</div>
        <EmptyState title="Search for news" body="Try a topic, person, or event to get started." />
        <EmptyState variant="noresults" title="No matches" body="Nothing found for that search." />
        <EmptyState
          variant="error"
          title="Something went wrong"
          body="The news service is unreachable. Try again in a moment."
        />
      </section>

      <section style={section}>
        <div style={label}>Toast</div>
        <div style={row}>
          <button
            type="button"
            onClick={() =>
              setToast({
                kind: "success",
                title: "Analysis complete",
                body: "Cached from a previous run.",
                action: {
                  label: "View",
                  onClick: () => alert("View clicked"),
                },
              })
            }
            style={{
              padding: "8px 14px",
              borderRadius: "var(--r-pill)",
              background: "var(--ink)",
              color: "var(--paper)",
            }}
          >
            Show success toast
          </button>
          <button
            type="button"
            onClick={() =>
              setToast({
                kind: "error",
                title: "Couldn't reach the AI",
                body: "Please retry.",
                action: { label: "Retry", onClick: () => setToast(null) },
              })
            }
            style={{
              padding: "8px 14px",
              borderRadius: "var(--r-pill)",
              background: "var(--neg)",
              color: "var(--paper)",
            }}
          >
            Show error toast
          </button>
          <button
            type="button"
            onClick={() =>
              setToast({
                kind: "success",
                title: "Saved",
                body: "Auto-dismisses in 4.5s.",
              })
            }
            style={{
              padding: "8px 14px",
              borderRadius: "var(--r-pill)",
              background: "var(--accent)",
              color: "var(--paper)",
            }}
          >
            Show auto-dismiss toast
          </button>
        </div>
      </section>

      <section style={section}>
        <div style={label}>SearchBar — desktop</div>
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          onClear={() => setSearchValue("")}
          placeholder="Search news — try AI regulation, climate policy, markets…"
        />
        <div style={label}>SearchBar — desktop, loading</div>
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          onClear={() => setSearchValue("")}
          loading
        />
        <div style={label}>SearchBar — mobile</div>
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          onClear={() => setSearchValue("")}
          variant="mobile"
        />
      </section>

      <section style={section}>
        <div style={label}>Header — desktop</div>
        <Header
          query={searchValue}
          onQueryChange={setSearchValue}
          onClear={() => setSearchValue("")}
          historyCount={12}
          cacheHits={4}
        />
        <div style={label}>Header — mobile</div>
        <Header
          query={searchValue}
          onQueryChange={setSearchValue}
          onClear={() => setSearchValue("")}
          isMobile
          historyCount={12}
          cacheHits={4}
        />
      </section>

      <section style={section}>
        <div style={label}>ArticleCard — idle</div>
        <ArticleCard
          article={sampleArticle}
          onAnalyze={() => setToast({ kind: "success", title: "Analyze clicked" })}
        />
        <div style={label}>ArticleCard — analyzing</div>
        <ArticleCard article={sampleArticle} state="analyzing" />
        <div style={label}>ArticleCard — analyzed</div>
        <ArticleCard
          article={sampleArticle}
          state="analyzed"
          analysis={sampleHistory[0].analysis}
        />
        <div style={label}>ArticleCard — cached</div>
        <ArticleCard
          article={sampleArticle}
          state="cached"
          analysis={sampleHistory[1].analysis}
          cachedFrom={{ date: "yesterday" }}
          onOpenCached={() => setSelected(sampleHistory[1])}
        />
        <div style={label}>ArticleCard — error (rate-limit)</div>
        <ArticleCard
          article={sampleArticle}
          state="error"
          error="rate-limit"
          onRetry={() => setToast({ kind: "success", title: "Retry clicked" })}
        />
      </section>

      <section style={{ ...section, height: 520 }}>
        <div style={label}>HistoryPane</div>
        <HistoryPane
          history={filteredHistory}
          totalCount={sampleHistory.length}
          counts={historyCounts}
          filter={filter}
          onFilter={setFilter}
          onSelect={setSelected}
        />
      </section>

      <section style={section}>
        <div style={label}>HistoryPane — empty</div>
        <div style={{ height: 320 }}>
          <HistoryPane
            history={[]}
            totalCount={0}
            counts={{ all: 0, positive: 0, neutral: 0, negative: 0 }}
            filter="all"
            onFilter={() => {}}
            onSelect={() => {}}
            isMobile
            onSwitchToSearch={() => setToast({ kind: "success", title: "Switch to search" })}
          />
        </div>
      </section>

      <section style={section}>
        <div style={label}>Drawer</div>
        <div style={row}>
          <button
            type="button"
            onClick={() => setSelected(sampleHistory[0])}
            style={{
              padding: "8px 14px",
              borderRadius: "var(--r-pill)",
              background: "var(--ink)",
              color: "var(--paper)",
            }}
          >
            Open desktop drawer
          </button>
          <button
            type="button"
            onClick={() => setSelected(sampleHistory[2])}
            style={{
              padding: "8px 14px",
              borderRadius: "var(--r-pill)",
              background: "var(--neg)",
              color: "var(--paper)",
            }}
          >
            Open (negative item)
          </button>
        </div>
      </section>

      <section style={section}>
        <div style={label}>TabBar (fixed at bottom)</div>
        <p style={{ color: "var(--ink3)", fontSize: 13 }}>
          Active tab:&nbsp;<strong>{tab}</strong>
        </p>
      </section>

      <Drawer item={selected} onClose={() => setSelected(null)} />
      <TabBar active={tab} onChange={setTab} historyCount={3} />
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
