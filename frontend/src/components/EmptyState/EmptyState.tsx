import type { ReactNode } from "react";
import styles from "./EmptyState.module.css";
import { cx } from "../../lib/cx";

type Variant = "default" | "noresults" | "error";

interface EmptyStateProps {
  variant?: Variant;
  title: string;
  body?: string;
  /** Custom icon node. Pass `false` to suppress the icon entirely. */
  icon?: ReactNode | false;
  children?: ReactNode;
}

const MARK_CLASS: Record<Variant, string> = {
  default: styles.markDefault,
  noresults: styles.markNoresults,
  error: styles.markError,
};

function DefaultIcon() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="1.5"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
    </svg>
  );
}

export function EmptyState({ variant = "default", title, body, icon, children }: EmptyStateProps) {
  const showIcon = icon !== false;
  return (
    <div className={styles.empty}>
      {showIcon && (
        <div className={cx(styles.mark, MARK_CLASS[variant])} aria-hidden="true">
          {icon ?? (variant === "error" ? "!" : <DefaultIcon />)}
        </div>
      )}
      <h2 className={styles.title}>{title}</h2>
      {body && <p className={styles.sub}>{body}</p>}
      {children}
    </div>
  );
}
