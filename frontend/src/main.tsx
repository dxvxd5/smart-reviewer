import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./styles/reset.css";
import "./styles/base.css";
import "./styles/animations.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <div style={{ padding: "var(--sp-6)", fontFamily: "var(--serif)" }}>
        <h1 style={{ fontSize: 32, color: "var(--ink)" }}>Smart Reviewer</h1>
        <p style={{ color: "var(--ink2)", marginTop: "var(--sp-3)" }}>
          API layer ready. Components coming next.
        </p>
      </div>
    </QueryClientProvider>
  </StrictMode>,
);
