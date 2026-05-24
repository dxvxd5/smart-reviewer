// queryKeys.ts — single source of truth for TanStack Query cache keys.

export const queryKeys = {
  news: (query: string) => ["news", query] as const,
  history: () => ["history"] as const,
};
