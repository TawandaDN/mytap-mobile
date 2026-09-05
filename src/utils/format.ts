export function formatPula(n: number): string {
  return `P${n.toLocaleString('en-BW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPx(n: number): string {
  const sign = n < 0 ? '-' : '';
  return `${sign}P${Math.abs(n).toLocaleString('en-BW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function maskCard(last4: string): string {
  return `•••• •••• •••• ${last4}`;
}

export function shortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-BW', { day: 'numeric', month: 'short' });
}

export function greetingForHour(h: number): string {
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export const guardrailProfile = {
  used: 383.59,
  monthlyLimit: 10000,
  pct: 4,
};
