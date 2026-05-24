import { type RefObject } from "react";
import { Spinner } from "../Spinner/Spinner";
import styles from "./SearchBar.module.css";
import { cx } from "../../lib/cx";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  loading?: boolean;
  placeholder?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  showKbd?: boolean;
  variant?: "desktop" | "mobile";
}

export function SearchBar({
  value,
  onChange,
  onClear,
  loading = false,
  placeholder = "Search news…",
  inputRef,
  showKbd = true,
  variant = "desktop",
}: SearchBarProps) {
  const cls = cx(styles.root, variant === "mobile" && styles.mobile, loading && styles.loading);

  return (
    <div className={cls}>
      <label htmlFor="sr-search-input" className="sr-only">
        Search news
      </label>

      <span className={styles.icon} aria-hidden="true">
        {loading ? (
          <Spinner size={15} color="var(--accent)" />
        ) : (
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--ink3)"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" />
          </svg>
        )}
      </span>

      <input
        id="sr-search-input"
        ref={inputRef}
        type="search"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck="false"
        aria-busy={loading}
      />

      {value && (
        <button type="button" className={styles.clear} onClick={onClear} aria-label="Clear search">
          ×
        </button>
      )}

      {showKbd && (
        <span className={styles.kbd} aria-hidden="true">
          ⌘ K
        </span>
      )}
    </div>
  );
}
