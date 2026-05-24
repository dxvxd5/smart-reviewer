import { type RefObject } from "react";
import { Spinner } from "../Spinner/Spinner";
import { SearchIcon } from "../icons/SearchIcon";
import styles from "./SearchBar.module.css";
import { cx } from "../../lib/cx";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  loading?: boolean;
  placeholder?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  variant?: "desktop" | "mobile";
}

export function SearchBar({
  value,
  onChange,
  onClear,
  loading = false,
  placeholder = "Search news…",
  inputRef,
  variant = "desktop",
}: SearchBarProps) {
  const cls = cx(styles.root, variant === "mobile" && styles.mobile, loading && styles.loading);

  return (
    <div className={cls}>
      <label htmlFor="sr-search-input" className="sr-only">
        Search news
      </label>

      <span className={styles.icon} aria-hidden="true">
        {loading ? <Spinner size={15} color="var(--accent)" /> : <SearchIcon />}
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
    </div>
  );
}
