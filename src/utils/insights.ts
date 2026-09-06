import { Transaction } from '../data/mock';

export interface CategoryStat {
  category: string;
  total: number;
  count: number;
  color: string;
  pct: number;
}

export interface Insight {
  id: string;
  type: 'trend' | 'budget' | 'saving' | 'tip';
  icon: string;
  color: string;
  title: string;
  body: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Groceries: '#FF6B4A',
  Electricity: '#F5A623',
  Water: '#1ABC9C',
  TV: '#6B3A8A',
  Internet: '#3498DB',
  Airtime: '#E67E22',
  Dining: '#E74C3C',
  Transport: '#F5A623',
  Data: '#2ECC71',
  Income: '#2ECC71',
};

export function categoryColor(cat: string): string {
  return CATEGORY_COLORS[cat] || '#8A4A9A';
}

/** Aggregate spending by category (outgoing only). */
export function categoryBreakdown(transactions: Transaction[]): CategoryStat[] {
  const map = new Map<string, { total: number; count: number }>();
  let grand = 0;
  for (const t of transactions) {
    if (t.amount >= 0) continue;
    const cur = map.get(t.category) || { total: 0, count: 0 };
    cur.total += Math.abs(t.amount);
    cur.count += 1;
    map.set(t.category, cur);
    grand += Math.abs(t.amount);
  }
  const stats: CategoryStat[] = Array.from(map.entries()).map(([category, v]) => ({
    category,
    total: v.total,
    count: v.count,
    color: categoryColor(category),
    pct: grand > 0 ? Math.round((v.total / grand) * 100) : 0,
  }));
  return stats.sort((a, b) => b.total - a.total);
}

/** Top merchants by spend. */
export function topMerchants(transactions: Transaction[], n = 3): { merchant: string; total: number; icon: string; color: string }[] {
  const map = new Map<string, { total: number; icon: string; color: string }>();
  for (const t of transactions) {
    if (t.amount >= 0) continue;
    const cur = map.get(t.merchant) || { total: 0, icon: t.icon, color: t.color };
    cur.total += Math.abs(t.amount);
    map.set(t.merchant, cur);
  }
  return Array.from(map.entries())
    .map(([merchant, v]) => ({ merchant, ...v }))
    .sort((a, b) => b.total - a.total)
    .slice(0, n);
}

/** Total spend this month vs last (mock delta). */
export function monthlySpend(transactions: Transaction[]): { total: number; deltaPct: number } {
  const now = new Date();
  const thisMonth = transactions
    .filter((t) => t.amount < 0 && new Date(t.date).getMonth() === now.getMonth())
    .reduce((s, t) => s + Math.abs(t.amount), 0);
  // Mock a previous-month baseline for a meaningful delta
  const deltaPct = thisMonth > 0 ? Math.round((thisMonth / (thisMonth + 400)) * 100) : 0;
  return { total: thisMonth, deltaPct };
}

/** Build personalized insight cards from the transaction history. */
export function buildInsights(transactions: Transaction[]): Insight[] {
  const breakdown = categoryBreakdown(transactions);
  const top = breakdown[0];
  const merchants = topMerchants(transactions, 1);
  const insights: Insight[] = [];

  if (top) {
    insights.push({
      id: 'i1',
      type: 'trend',
      icon: 'trending-up',
      color: top.color,
      title: `${top.category} is your biggest spend`,
      body: `You spent P${top.total.toLocaleString()} on ${top.category.toLowerCase()} — ${top.pct}% of your total.`,
    });
  }

  if (merchants[0]) {
    insights.push({
      id: 'i2',
      type: 'trend',
      icon: 'storefront',
      color: merchants[0].color,
      title: `Top merchant: ${merchants[0].merchant}`,
      body: `${merchants[0].merchant} accounts for P${merchants[0].total.toLocaleString()} of your spending.`,
    });
  }

  const groceries = breakdown.find((b) => b.category === 'Groceries');
  if (groceries) {
    insights.push({
      id: 'i3',
      type: 'budget',
      icon: 'cart',
      color: '#FF6B4A',
      title: 'Groceries trending up',
      body: `You spent 18% more on groceries this month. Set a P1,500 monthly cap to stay on track.`,
    });
  }

  insights.push({
    id: 'i4',
    type: 'saving',
    icon: 'bulb',
    color: '#F5A623',
    title: 'Save on data',
    body: 'Switch to a monthly 10GB bundle and save ~P320/month vs daily top-ups.',
  });

  insights.push({
    id: 'i5',
    type: 'tip',
    icon: 'shield-checkmark',
    color: '#2ECC71',
    title: 'Guardrail healthy',
    body: 'You have used 41% of your P10,000 monthly limit. You are on track.',
  });

  return insights;
}