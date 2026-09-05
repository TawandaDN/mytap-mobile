export interface Card {
  id: string;
  name: string;
  type: 'wallet' | 'mastercard' | 'myzaka';
  balance: number;
  last4: string;
  frozen: boolean;
  gradient: readonly [string, string, string];
}

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  icon: string;
  color: string;
}

export interface Tariff {
  name: string;
  provider: string;
  totalGB: number;
  usedGB: number;
  leftGB: number;
  usedPct: number;
  renews: string;
  color: string;
}

export interface Sticker {
  id: string;
  name: string;
  serial: string;
  status: 'active' | 'frozen';
  uses: number;
  lastUsed: string;
}

export const cards: Card[] = [
  {
    id: 'wallet',
    name: 'MyTap Wallet',
    type: 'wallet',
    balance: 3553.77,
    last4: '3321',
    frozen: false,
    gradient: ['#1A2A4A', '#2D3B6B', '#FF6B4A'],
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    type: 'mastercard',
    balance: 3877.0,
    last4: '1190',
    frozen: false,
    gradient: ['#2D3B6B', '#4A6A8A', '#F5A623'],
  },
  {
    id: 'myzaka',
    name: 'MyZaka Card',
    type: 'myzaka',
    balance: 1200.0,
    last4: '4455',
    frozen: false,
    gradient: ['#1A2A4A', '#3D2B6B', '#8A4A9A'],
  },
];

export const transactions: Transaction[] = [
  {
    id: 't1',
    merchant: 'BPC',
    category: 'Airtime',
    amount: -100.0,
    date: '2026-08-29',
    icon: '⚡',
    color: '#F5A623',
  },
  {
    id: 't2',
    merchant: 'Mascom',
    category: 'Data',
    amount: -5.0,
    date: '2026-08-29',
    icon: '📶',
    color: '#3498DB',
  },
  {
    id: 't3',
    merchant: 'Choppies',
    category: 'Groceries',
    amount: -278.59,
    date: '2026-08-29',
    icon: '🛒',
    color: '#2ECC71',
  },
];

export const tariff: Tariff = {
  name: 'Mascom Connect 10GB',
  provider: 'Mascom',
  totalGB: 10,
  usedGB: 8.4,
  leftGB: 1.6,
  usedPct: 84,
  renews: '2026-08-30',
  color: '#3498DB',
};

export const stickers: Sticker[] = [
  {
    id: 's1',
    name: 'Kitchen Sticker',
    serial: 'MT-STK-8842',
    status: 'active',
    uses: 12,
    lastUsed: '2026-08-29',
  },
  {
    id: 's2',
    name: 'Car Sticker',
    serial: 'MT-STK-1190',
    status: 'frozen',
    uses: 4,
    lastUsed: '2026-08-20',
  },
];

export const merchants = [
  { id: 'bpc', name: 'BPC', category: 'Airtime', icon: '⚡', color: '#F5A623' },
  { id: 'mascom', name: 'Mascom', category: 'Data', icon: '📶', color: '#3498DB' },
  { id: 'choppies', name: 'Choppies', category: 'Groceries', icon: '🛒', color: '#2ECC71' },
  { id: 'btc', name: 'BTC', category: 'Internet', icon: '🌐', color: '#8A4A9A' },
  { id: 'dstv', name: 'DStv', category: 'TV', icon: '📺', color: '#FF6B4A' },
  { id: 'water', name: 'Water', category: 'Utilities', icon: '💧', color: '#3498DB' },
];
