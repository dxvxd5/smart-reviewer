export const queryKeys = {
  news: (query: string) => ["news", query] as const,
  history: () => ["history"] as const,
};
