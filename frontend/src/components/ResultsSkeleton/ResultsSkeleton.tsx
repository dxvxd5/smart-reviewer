import { Skeleton } from "../Skeleton/Skeleton";
import styles from "./ResultsSkeleton.module.css";

export function ResultsSkeleton() {
  return (
    <div className={styles.root}>
      <Skeleton w={92} h={92} />
      <div className={styles.stack}>
        <Skeleton h={12} w="40%" />
        <Skeleton h={18} />
        <Skeleton h={14} w="92%" />
        <Skeleton h={14} w="76%" />
      </div>
    </div>
  );
}

export function ResultsSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <ResultsSkeleton key={i} />
      ))}
    </>
  );
}
