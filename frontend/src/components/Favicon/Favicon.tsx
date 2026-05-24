import styles from "./Favicon.module.css";

interface FaviconProps {
  domain: string;
  size?: number;
}

export function Favicon({ domain, size = 14 }: FaviconProps) {
  return (
    <img
      className={styles.favicon}
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
    />
  );
}
