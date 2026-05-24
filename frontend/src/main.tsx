import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/reset.css";
import "./styles/base.css";
import "./styles/animations.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div style={{ padding: "var(--sp-6)", fontFamily: "var(--serif)" }}>
      <h1 style={{ fontSize: 32, color: "var(--ink)" }}>Smart Reviewer</h1>
      <p style={{ color: "var(--ink2)", marginTop: "var(--sp-3)" }}>
        Foundations ready. Components coming next.
      </p>
    </div>
  </StrictMode>,
);
