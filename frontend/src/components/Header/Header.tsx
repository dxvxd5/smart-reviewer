import { type RefObject } from "react";
import { SearchBar } from "../SearchBar/SearchBar";
import styles from "./Header.module.css";

export interface HeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
  onClear: () => void;
  loading?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
  isMobile?: boolean;
  historyCount: number;
  cacheHits: number;
}

export function Header({
  query,
  onQueryChange,
  onClear,
  loading = false,
  inputRef,
  isMobile = false,
  historyCount,
  cacheHits,
}: HeaderProps) {
  return (
    <header className={`${styles.root} ${isMobile ? styles.mobile : ""}`.trim()}>
      <a href="#" className={styles.brand} aria-label="Smart Reviewer home">
        <span className={styles.logo} aria-hidden="true">
          S
        </span>
        <span className={styles.title}>Smart Reviewer</span>
      </a>

      <div className={styles.searchSlot}>
        <SearchBar
          value={query}
          onChange={onQueryChange}
          onClear={onClear}
          loading={loading}
          placeholder="Search news — try AI regulation, climate policy, markets…"
          inputRef={inputRef}
          variant={isMobile ? "mobile" : "desktop"}
        />
      </div>

      <div className={styles.counter} aria-live="polite">
        {historyCount} read
        {cacheHits > 0 && (
          <>
            {" · "}
            <span className={styles.counterCache}>{cacheHits} instant</span>
          </>
        )}
      </div>
    </header>
  );
}
