import type { CSSProperties } from "react";
import styles from "./Skeleton.module.css";

interface SkeletonProps {
  w?: number | string;
  h?: number | string;
  style?: CSSProperties;
}

export function Skeleton({ w = "100%", h = 12, style }: SkeletonProps) {
  return (
    <span
      className={styles.skeleton}
      style={{ width: w, height: h, ...style }}
      aria-hidden="true"
    />
  );
}
