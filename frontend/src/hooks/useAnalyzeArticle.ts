import { useMutation, useQueryClient } from "@tanstack/react-query";

import { analyzeArticle } from "../api/articles";
import { queryKeys } from "../api/queryKeys";
import type { Article, AnalyzeResponse } from "../types";

/**
 * Analyze a single article. On success, invalidates the history query so the
 * history pane refetches and reflects the new (or cached) row.
 */
export function useAnalyzeArticle() {
  const qc = useQueryClient();

  return useMutation<AnalyzeResponse, Error, Article>({
    mutationFn: (article) => analyzeArticle(article),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.history() });
    },
  });
}
