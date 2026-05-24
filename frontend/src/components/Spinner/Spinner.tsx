import styles from "./Spinner.module.css";

interface SpinnerProps {
  size?: number;
  color?: string;
}

export function Spinner({ size = 14, color = "currentColor" }: SpinnerProps) {
  return (
    <svg
      className={styles.spinner}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="14 40"
      />
    </svg>
  );
}
