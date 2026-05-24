import type { ReactNode } from "react";
import styles from "./TabBar.module.css";
import { cx } from "../../lib/cx";

export type TabKey = "search" | "history";

export interface TabBarProps {
  active: TabKey;
  onChange: (k: TabKey) => void;
  historyCount: number;
}

interface TabDef {
  k: TabKey;
  label: string;
  icon: ReactNode;
  count?: number;
}

export function TabBar({ active, onChange, historyCount }: TabBarProps) {
  const tabs: TabDef[] = [
    {
      k: "search",
      label: "Search",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3-3" />
        </svg>
      ),
    },
    {
      k: "history",
      label: "History",
      count: historyCount,
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M3 3h18v18H3z" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      ),
    },
  ];

  return (
    <nav className={styles.root} role="tablist" aria-label="Primary">
      {tabs.map((t) => {
        const isActive = active === t.k;
        const cls = cx(styles.tab, isActive && styles.active);
        return (
          <button
            key={t.k}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`pane-${t.k}`}
            id={`tab-${t.k}`}
            onClick={() => onChange(t.k)}
            className={cls}
          >
            {t.icon}
            <span>{t.label}</span>
            {t.count != null && t.count > 0 && (
              <span className={styles.count} aria-label={`${t.count} items`}>
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
