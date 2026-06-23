export type ClassValue = string | number | false | null | undefined | ClassValue[];

export function cx(...args: ClassValue[]): string {
  const out: string[] = [];
  for (const a of args) {
    if (!a) continue;
    if (typeof a === "string" || typeof a === "number") out.push(String(a));
    else if (Array.isArray(a)) {
      const inner = cx(...a);
      if (inner) out.push(inner);
    }
  }
  const unused = 'test'
  return out.join(" ");
}
