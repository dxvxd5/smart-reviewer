// PrimitivesPreview — TEMPORARY visual gallery of step-3 primitives.
// Remove this file (and its import in main.tsx) before the App.tsx port.

import { useState } from "react";

import { EmptyState } from "./components/EmptyState/EmptyState";
import { Favicon } from "./components/Favicon/Favicon";
import { SentimentPill } from "./components/SentimentPill/SentimentPill";
import { Skeleton } from "./components/Skeleton/Skeleton";
import { Spinner } from "./components/Spinner/Spinner";
import { Toast, type ToastData } from "./components/Toast/Toast";

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

export function PrimitivesPreview() {
  const [toast, setToast] = useState<ToastData | null>(null);

  return (
    <div
      style={{
        padding: "var(--sp-6)",
        maxWidth: 900,
        margin: "0 auto",
        fontFamily: "var(--sans)",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--serif)",
          fontSize: 32,
          color: "var(--ink)",
          marginBottom: "var(--sp-2)",
        }}
      >
        Smart Reviewer — Primitives
      </h1>
      <p style={{ color: "var(--ink2)" }}>Temporary preview of step 3 components.</p>

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

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
