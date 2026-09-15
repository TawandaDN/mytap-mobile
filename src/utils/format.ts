/**
 * Currency + date formatting.
 *
 * Pula is written with the symbol BEFORE the amount and a single space:
 * "P 3,457.37". Amounts carry two decimals and tabular figures so stacked
 * columns align on the decimal point.
 */

const money = (n: number): string =>
  Math.abs(n).toLocaleString('en-BW', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** "P 3,457.37" — always two decimals. */
export function formatPula(n: number): string {
  const sign = n < 0 ? '-' : '';
  return `${sign}P ${money(n)}`;
}

/** Signed amount for ledger rows — "-P 100.00" / "P 100.00". */
export function formatPx(n: number): string {
  return formatPula(n);
}

/** Bare grouped number without the symbol. */
export function formatNumber(n: number, decimals = 2): string {
  return Math.abs(n).toLocaleString('en-BW', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function maskCard(last4: string): string {
  return `•••• •••• •••• ${last4}`;
}

export function shortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-BW', { day: 'numeric', month: 'short' });
}

/** "August 5, Wed" — the timeline feed's date-group header. */
export function groupDateLabel(iso: string): string {
  const d = new Date(iso);
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  const day = d.getDate();
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
  return `${month} ${day}, ${weekday}`;
}

/** Stable key for grouping ledger rows by calendar day. */
export function dayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function timeLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-BW', { hour: '2-digit', minute: '2-digit' });
}

export function greetingForHour(h: number): string {
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export const guardrailProfile = {
  used: 383.59,
  monthlyLimit: 10000,
  pct: 4,
};
