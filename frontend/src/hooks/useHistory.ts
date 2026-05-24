import { useQuery } from "@tanstack/react-query";

import { getHistory } from "../api/articles";
import { queryKeys } from "../api/queryKeys";

export function useHistory() {
  return useQuery({
    queryKey: queryKeys.history(),
    queryFn: ({ signal }) => getHistory(signal),
    staleTime: 30_000,
  });
}
