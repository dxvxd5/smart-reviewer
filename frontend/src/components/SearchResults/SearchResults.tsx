import {
  ArticleCard,
  type ArticleCardState,
  type ArticleErrorKind,
} from "../ArticleCard/ArticleCard";
import { EmptyState } from "../EmptyState/EmptyState";
import { ResultsSkeleton } from "../ResultsSkeleton/ResultsSkeleton";
import type { useNewsSearch } from "../../hooks/useNewsSearch";
import type { Analysis, Article } from "../../types";
import styles from "./SearchResults.module.css";

export interface CardState {
  state: ArticleCardState;
  analysis?: Analysis;
  error?: ArticleErrorKind;
  cachedFrom?: { date: string };
}

interface SearchResultsProps {
  query: string;
  search: ReturnType<typeof useNewsSearch>;
  articles: Article[];
  cardFor: (a: Article) => CardState;
  onAnalyze: (a: Article) => void;
  onOpenCached: (a: Article) => void;
  onFocusSearch: () => void;
}

export function SearchResults({
  query,
  search,
  articles,
  cardFor,
  onAnalyze,
  onOpenCached,
  onFocusSearch,
}: SearchResultsProps) {
  const trimmed = query.trim();

  if (trimmed.length < 2) {
    return (
      <EmptyState
        title="Search the news"
        body="Type a topic above — AI regulation, climate policy, markets — and we'll pull the latest stories."
      >
        <button type="button" onClick={onFocusSearch} className={styles.primaryBtn}>
          Focus search
        </button>
      </EmptyState>
    );
  }

  if (search.isError) {
    return (
      <EmptyState
        variant="error"
        title="Couldn't load news"
        body="We hit an error reaching the news service. Try again in a moment."
      >
        <button type="button" onClick={() => search.refetch()} className={styles.primaryBtn}>
          Try again
        </button>
      </EmptyState>
    );
  }

  if (search.isLoading || (search.isFetching && articles.length === 0)) {
    return (
      <>
        <ResultsSkeleton />
        <ResultsSkeleton />
        <ResultsSkeleton />
      </>
    );
  }

  if (articles.length === 0) {
    return (
      <EmptyState
        variant="noresults"
        title="No results"
        body={`No stories found for "${trimmed}". Try a different topic.`}
      />
    );
  }

  return (
    <>
      {articles.map((article) => {
        const cs = cardFor(article);
        return (
          <ArticleCard
            key={article.url}
            article={article}
            state={cs.state}
            analysis={cs.analysis}
            error={cs.error}
            cachedFrom={cs.cachedFrom}
            onAnalyze={() => onAnalyze(article)}
            onRetry={() => onAnalyze(article)}
            onOpenCached={() => onOpenCached(article)}
          />
        );
      })}
    </>
  );
}
