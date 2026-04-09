// Shared number formatting utilities.
//
// fmtK  — general dollar formatter (input: raw dollars)
//   < $1 000        → "$NNN"
//   $1 000–$999 999 → "$NNNk"
//   ≥ $1 000 000    → "$N.NM"
//
// fmtM  — millions/billions formatter (input: value already in $M)
//   < $1 000M       → "$NM"
//   ≥ $1 000M       → "$N.NB"
//
// fmtPct — percentage formatter (input: decimal, e.g. 12.5)
//   → "12.5%"

export function fmtK(n) {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${Math.round(n).toLocaleString()}`;
}

export function fmtM(v) {
  return v >= 1000 ? `$${(v / 1000).toFixed(1)}B` : `$${v}M`;
}

export function fmtPct(n) {
  return `${n.toFixed(1)}%`;
}
