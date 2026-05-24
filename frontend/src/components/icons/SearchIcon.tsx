interface SearchIconProps {
  size?: number;
  color?: string;
}

export function SearchIcon({ size = 15, color = "var(--ink3)" }: SearchIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
    </svg>
  );
}
