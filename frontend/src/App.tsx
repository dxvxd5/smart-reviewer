import { useMemo, useRef, useState } from "react";
import { isAxiosError } from "axios";

import { Header } from "./components/Header/Header";
import {
  HistoryPane,
  type HistoryCounts,
  type HistoryFilter,
} from "./components/HistoryPane/HistoryPane";
import { Drawer } from "./components/Drawer/Drawer";
import { TabBar, type TabKey } from "./components/TabBar/TabBar";
import { SearchResults, type CardState } from "./components/SearchResults/SearchResults";
import type { ArticleErrorKind } from "./components/ArticleCard/ArticleCard";

import { useIsMobile } from "./hooks/useIsMobile";
import { useNewsSearch } from "./hooks/useNewsSearch";
import { useAnalyzeArticle } from "./hooks/useAnalyzeArticle";
import { useHistory } from "./hooks/useHistory";
import { relativeTime } from "./lib/relativeTime";
import { cx } from "./lib/cx";
import type { Analysis, Article, HistoryItem } from "./types";

import styles from "./App.module.css";

function errorKindFrom(err: unknown): ArticleErrorKind {
  if (isAxiosError(err)) {
    if (err.code === "ECONNABORTED") return "timeout";
    if (err.response?.status === 429) return "rate-limit";
  }
  return "network";
}

function toHistoryItem(
  article: Article,
  analysis: Analysis,
  originallyAnalyzedAt: string,
): HistoryItem {
  return {
    id: article.url,
    article,
    analysis,
    cached: true,
    originallyAnalyzedAt,
  };
}

export function App() {
  const isMobile = useIsMobile();

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<TabKey>("search");
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const [selected, setSelected] = useState<HistoryItem | null>(null);
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});
  const [cacheHits, setCacheHits] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const search = useNewsSearch(query);
  const history = useHistory();
  const analyze = useAnalyzeArticle();

  const historyItems = useMemo(() => history.data ?? [], [history.data]);
  const historyByUrl = useMemo(() => {
    const m = new Map<string, HistoryItem>();
    for (const h of historyItems) m.set(h.article.url, h);
    return m;
  }, [historyItems]);

  const counts: HistoryCounts = useMemo(
    () => ({
      all: historyItems.length,
      positive: historyItems.filter((h) => h.analysis.sentiment === "positive").length,
      neutral: historyItems.filter((h) => h.analysis.sentiment === "neutral").length,
      negative: historyItems.filter((h) => h.analysis.sentiment === "negative").length,
    }),
    [historyItems],
  );

  const filteredHistory = useMemo(
    () =>
      filter === "all" ? historyItems : historyItems.filter((h) => h.analysis.sentiment === filter),
    [historyItems, filter],
  );

  const setCard = (url: string, next: CardState) => {
    setCardStates((prev) => ({ ...prev, [url]: next }));
  };

  const handleAnalyze = (article: Article) => {
    setCard(article.url, { state: "analyzing" });
    analyze.mutate(article, {
      onSuccess: (res) => {
        if (res.cached) {
          setCacheHits((n) => n + 1);
          setCard(article.url, {
            state: "cached",
            analysis: res.analysis,
            cachedFrom: { date: relativeTime(res.originallyAnalyzedAt) },
          });
        } else {
          setCard(article.url, { state: "analyzed", analysis: res.analysis });
        }
      },
      onError: (err) => {
        setCard(article.url, { state: "error", error: errorKindFrom(err) });
      },
    });
  };

  const cardFor = (article: Article): CardState => {
    const userState = cardStates[article.url];
    if (userState) return userState;
    const hit = historyByUrl.get(article.url);
    if (hit) {
      return {
        state: "cached",
        analysis: hit.analysis,
        cachedFrom: { date: relativeTime(hit.originallyAnalyzedAt) },
      };
    }
    return { state: "idle" };
  };

  const openCachedDrawer = (article: Article) => {
    const hit = historyByUrl.get(article.url);
    const local = cardStates[article.url];
    if (hit) {
      setSelected(hit);
    } else if (local?.analysis) {
      setSelected(
        toHistoryItem(article, local.analysis, new Date(Date.now() - 1000).toISOString()),
      );
    }
  };

  const showSearchPane = !isMobile || tab === "search";
  const showHistoryPane = !isMobile || tab === "history";
  const articles = search.data ?? [];

  return (
    <div className={cx(styles.app, isMobile && styles.mobile)}>
      <Header
        query={query}
        onQueryChange={setQuery}
        onClear={() => setQuery("")}
        loading={search.isFetching && query.trim().length >= 2}
        inputRef={inputRef}
        isMobile={isMobile}
        historyCount={historyItems.length}
        cacheHits={cacheHits}
      />

      <main className={styles.main}>
        {showSearchPane && (
          <section className={styles.results} aria-labelledby="search-heading">
            <SearchResults
              query={query}
              search={search}
              articles={articles}
              cardFor={cardFor}
              onAnalyze={handleAnalyze}
              onOpenCached={openCachedDrawer}
              onFocusSearch={() => inputRef.current?.focus()}
              headingId="search-heading"
            />
          </section>
        )}

        {showHistoryPane && (
          <aside className={styles.sidebar} aria-labelledby="history-heading">
            <HistoryPane
              history={filteredHistory}
              totalCount={historyItems.length}
              counts={counts}
              filter={filter}
              onFilter={setFilter}
              onSelect={setSelected}
              isMobile={isMobile}
              onSwitchToSearch={() => setTab("search")}
              headingId="history-heading"
              loading={history.isLoading}
            />
          </aside>
        )}
      </main>

      {isMobile && <TabBar active={tab} onChange={setTab} historyCount={historyItems.length} />}

      <Drawer item={selected} onClose={() => setSelected(null)} isMobile={isMobile} />
    </div>
  );
}
