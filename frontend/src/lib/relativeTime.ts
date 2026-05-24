// relativeTime.ts — format an ISO timestamp as a relative phrase
// like "2 minutes ago" using Intl.RelativeTimeFormat.

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const UNITS: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
  { unit: "year", seconds: 60 * 60 * 24 * 365 },
  { unit: "month", seconds: 60 * 60 * 24 * 30 },
  { unit: "week", seconds: 60 * 60 * 24 * 7 },
  { unit: "day", seconds: 60 * 60 * 24 },
  { unit: "hour", seconds: 60 * 60 },
  { unit: "minute", seconds: 60 },
  { unit: "second", seconds: 1 },
];

/** Returns a relative-time string for the given ISO timestamp (or Date). */
export function relativeTime(input: string | Date, now: Date = new Date()): string {
  const then = typeof input === "string" ? new Date(input) : input;
  const diffSeconds = Math.round((then.getTime() - now.getTime()) / 1000);
  const abs = Math.abs(diffSeconds);

  if (abs < 5) return "just now";

  for (const { unit, seconds } of UNITS) {
    if (abs >= seconds) {
      const value = Math.round(diffSeconds / seconds);
      return rtf.format(value, unit);
    }
  }
  return "just now";
}
