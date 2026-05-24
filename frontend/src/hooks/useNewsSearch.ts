import { useQuery } from "@tanstack/react-query";

import { searchNews } from "../api/news";
import { queryKeys } from "../api/queryKeys";
import { useDebounce } from "./useDebounce";

const MIN_QUERY_LEN = 2;
const DEBOUNCE_MS = 300;

/**
 * Search news as the user types. The query is debounced; queries shorter than
 * `MIN_QUERY_LEN` are not sent (the query stays disabled).
 */
export function useNewsSearch(rawQuery: string) {
  const query = useDebounce(rawQuery.trim(), DEBOUNCE_MS);
  const enabled = query.length >= MIN_QUERY_LEN;

  return useQuery({
    queryKey: queryKeys.news(query),
    queryFn: ({ signal }) => searchNews(query, signal),
    enabled,
    staleTime: 60_000,
  });
}
