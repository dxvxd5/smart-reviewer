import { useEffect, useRef, useState } from "react";

import styles from "./Toast.module.css";

export type ToastKind = "success" | "error";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastData {
  kind?: ToastKind;
  title: string;
  body?: string;
  action?: ToastAction;
}

interface ToastProps {
  toast: ToastData | null;
  onDismiss: () => void;
}

const AUTO_DISMISS_MS: Record<ToastKind, number> = {
  success: 4500,
  error: 8000,
};

type Phase = "in" | "out";

export function Toast({ toast, onDismiss }: ToastProps) {
  // Mirror the prop into local state so we can keep the DOM alive long enough
  // to play the exit animation after the parent clears the toast.
  // See https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [rendered, setRendered] = useState<ToastData | null>(toast);
  const [phase, setPhase] = useState<Phase>("in");
  const [prevToast, setPrevToast] = useState<ToastData | null>(toast);

  if (toast !== prevToast) {
    setPrevToast(toast);
    if (toast) {
      setRendered(toast);
      setPhase("in");
    } else if (rendered) {
      setPhase("out");
    }
  }

  const polite = !rendered || rendered.kind !== "error";
  const kind: ToastKind = rendered?.kind ?? "success";

  // Hold the latest onDismiss in a ref so changing identity (e.g. inline
  // arrow functions from the parent) doesn't reset the auto-dismiss timer.
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!rendered || rendered.action || phase === "out") return;
    const id = window.setTimeout(() => onDismissRef.current(), AUTO_DISMISS_MS[kind]);
    return () => window.clearTimeout(id);
  }, [rendered, phase, kind]);

  return (
    <div
      className={styles.region}
      role="region"
      aria-label="Notifications"
      aria-live={polite ? "polite" : "assertive"}
      aria-atomic="true"
    >
      {rendered && (
        <div
          className={`${styles.toast} ${styles[kind]} ${phase === "out" ? styles.exiting : ""}`}
          role="status"
          onAnimationEnd={() => {
            if (phase === "out") setRendered(null);
          }}
        >
          <span className={styles.icon} aria-hidden="true">
            {kind === "error" ? "!" : "✓"}
          </span>
          <div className={styles.body}>
            <div className={styles.title}>{rendered.title}</div>
            {rendered.body && <div className={styles.sub}>{rendered.body}</div>}
          </div>
          {rendered.action && (
            <button type="button" className={styles.action} onClick={rendered.action.onClick}>
              {rendered.action.label}
            </button>
          )}
          <button
            type="button"
            className={styles.close}
            onClick={onDismiss}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
