/**
 * MyTap mock data — Botswana digital life ecosystem.
 *
 * NFC sticker payments, QR payments, airtime & data, bill payments
 * (water, electricity, municipal), digital wallets and cards, transaction
 * history with digital receipts, telecom tariff tracking and spending
 * guardrails.
 */

/* ============ CARDS & WALLETS ============ */

export interface WalletCard {
  id: string;
  name: string;
  balance: number;
  last4: string;
  gradient: readonly [string, string, string];
  /** Broad instrument kind. */
  type: 'wallet' | 'mastercard' | 'myzaka' | 'card';
  /** Scheme mark printed on the card face. */
  brand: 'MASTERCARD' | 'VISA';
  currency: 'P';
  frozen?: boolean;
  virtual?: boolean;
  limit?: number;
  expiry: string;
  cvv: string;
  pin: string;
}

export const walletCards: WalletCard[] = [
  {
    id: 'wallet',
    name: 'MyTap Wallet',
    balance: 3457.37,
    last4: '3321',
    gradient: ['#1A2A4A', '#2D3B6B', '#FF6B4A'],
    type: 'wallet',
    brand: 'MASTERCARD',
    currency: 'P',
    expiry: '09/29',
    cvv: '482',
    pin: '3321',
    limit: 5000,
  },
  {
    id: 'myzaka',
    name: 'MyZaka Core',
    balance: 3877.0,
    last4: '1190',
    gradient: ['#2D3B6B', '#4A6A8A', '#F5A623'],
    type: 'card',
    brand: 'VISA',
    currency: 'P',
    expiry: '11/28',
    cvv: '731',
    pin: '1190',
    limit: 10000,
  },
  {
    id: 'fnb',
    name: 'FNB Debit',
    balance: 12450.0,
    last4: '4455',
    gradient: ['#1A2A4A', '#3D2B6B', '#8A4A9A'],
    type: 'card',
    brand: 'VISA',
    currency: 'P',
    expiry: '03/30',
    cvv: '205',
    pin: '4455',
    limit: 15000,
  },
];

/** Card Shop catalogue. */
export interface CardProduct {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  blurb: string;
  icon: string;
  color: string;
}

export const cardShop: CardProduct[] = [
  {
    id: 'cs-virtual',
    name: 'MyTap Virtual',
    price: 0,
    priceLabel: 'Free',
    blurb: 'Instant online card',
    icon: 'flash-outline',
    color: '#2ECC71',
  },
  {
    id: 'cs-physical',
    name: 'MyTap Physical',
    price: 35,
    priceLabel: 'P35.00',
    blurb: 'Tap card · delivered',
    icon: 'card-outline',
    color: '#1E3A5F',
  },
  {
    id: 'cs-metal',
    name: 'MyTap Metal',
    price: 250,
    priceLabel: 'P250.00',
    blurb: 'Premium finish · higher limits',
    icon: 'diamond-outline',
    color: '#F5A623',
  },
];

/* ============ TRANSACTIONS ============ */

export interface Transaction {
  id: string;
  merchant: string;
  /** Account / meter / phone identifier shown next to the merchant. */
  account?: string;
  category: string;
  amount: number;
  date: string;
  icon: string;
  color: string;
  status?: 'completed' | 'pending' | 'failed';
  ref?: string;
  method?: string;
}

export const transactions: Transaction[] = [
  { id: 't1', merchant: 'BPC', account: '14085142801', category: 'Airtime', amount: -100.0, date: '2026-08-29T10:04:00', icon: '⚡', color: '#F5A623', status: 'completed', ref: 'MT-482913', method: 'MyTap Wallet' },
  { id: 't2', merchant: 'Mascom', account: '71234567', category: 'Mascom data', amount: -5.0, date: '2026-08-29T11:32:00', icon: '📶', color: '#2ECC71', status: 'completed', ref: 'MT-482914', method: 'MyTap Wallet' },
  { id: 't3', merchant: 'Choppies Phakalane', category: 'Transfer', amount: -278.59, date: '2026-08-29T16:48:00', icon: '🛒', color: '#FF6B4A', status: 'completed', ref: 'MT-482915', method: 'Mastercard' },
  { id: 't4', merchant: 'Choppies Phakalane', category: 'Transfer', amount: -278.59, date: '2026-08-27T15:20:00', icon: '🛒', color: '#FF6B4A', status: 'completed', ref: 'MT-482701', method: 'Mastercard' },
  { id: 't5', merchant: 'BPC', account: '14085142801', category: 'Airtime', amount: -100.0, date: '2026-08-27T09:12:00', icon: '⚡', color: '#F5A623', status: 'completed', ref: 'MT-482700', method: 'MyTap Wallet' },
];

/* ============ TARIFF / TELECOM ASSET CORE ============ */

export interface TariffBreakdown {
  label: string;
  value: number;
  color: string;
}

export interface Tariff {
  id: string;
  provider: string;
  name: string;
  totalGB: number;
  usedGB: number;
  leftGB: number;
  usedPct: number;
  renews: string;
  color: string;
  autoRenew: boolean;
  /** Average daily consumption (GB). */
  avgDaily: number;
  /** Projected days of runway at the current burn rate. */
  runwayDays: number;
  breakdown: TariffBreakdown[];
}

export const tariff: Tariff = {
  id: 'mascom-connect',
  provider: 'Mascom',
  name: 'Connect 10GB',
  totalGB: 10,
  usedGB: 8.4,
  leftGB: 1.6,
  usedPct: 84,
  renews: '2026-08-30T00:00:00',
  color: '#2ECC71',
  autoRenew: true,
  avgDaily: 1.2,
  runwayDays: 1,
  breakdown: [
    { label: 'Social & messaging', value: 1.8, color: '#1E3A5F' },
    { label: 'Maps & updates', value: 0.8, color: '#FF6B4A' },
    { label: 'Hotspot', value: 0.9, color: '#F5A623' },
    { label: 'Web browsing', value: 1.5, color: '#2ECC71' },
    { label: 'Video streaming', value: 2.4, color: '#6B3A8A' },
  ],
};

export interface DataHistory {
  id: string;
  bundle: string;
  gb: number;
  price: number;
  date: string;
  status: 'active' | 'expired';
}

export const dataHistory: DataHistory[] = [
  { id: 'dh1', bundle: 'Mascom Connect 10GB', gb: 10, price: 150, date: '2026-07-30T00:00:00', status: 'active' },
  { id: 'dh2', bundle: 'Mascom Weekly 2GB', gb: 2, price: 30, date: '2026-07-15T00:00:00', status: 'expired' },
  { id: 'dh3', bundle: 'Mascom Daily 1GB', gb: 1, price: 15, date: '2026-07-02T00:00:00', status: 'expired' },
];

/* ============ PAYEES & CONTACTS ============ */

export interface Payee {
  id: string;
  name: string;
  lastAmount: number;
  category: string;
  icon: string;
  color: string;
}

export const recentPayees: Payee[] = [
  { id: 'p1', name: 'Nandos Ga...', lastAmount: 96, category: 'Dining', icon: '🍗', color: '#FF6B4A' },
  { id: 'p2', name: 'BPC', lastAmount: 100, category: 'Air', icon: '⚡', color: '#F5A623' },
  { id: 'p3', name: 'Mascom', lastAmount: 5, category: 'Data', icon: '📶', color: '#2ECC71' },
  { id: 'p4', name: 'Choppies P...', lastAmount: 278.59, category: 'Transfer', icon: '🛒', color: '#1E3A5F' },
];

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatarColor: string;
  recent?: boolean;
  /** Currency rail the contact sits on. */
  rail?: 'MyZaka' | 'MyTap';
}

export const contacts: Contact[] = [
  { id: 'c1', name: 'Kabelo M.', phone: '+267 72 111 222', avatarColor: '#2ECC71', recent: true, rail: 'MyZaka' },
  { id: 'c2', name: 'Thabo N.', phone: '+267 73 333 444', avatarColor: '#1E3A5F', recent: true, rail: 'MyZaka' },
  { id: 'c3', name: 'Lerato K.', phone: '+267 74 555 666', avatarColor: '#FF6B4A', recent: true, rail: 'MyZaka' },
  { id: 'c4', name: 'Odirile S.', phone: '+267 75 777 888', avatarColor: '#6B3A8A', rail: 'MyZaka' },
  { id: 'c5', name: 'Goitse P.', phone: '+267 76 999 000', avatarColor: '#F5A623', rail: 'MyZaka' },
];

/** MyZaka contacts — surfaced on the Payments screen below recent payees. */
export const myzakaContacts: Contact[] = contacts.slice(0, 4);

/* ============ MERCHANTS & UTILITIES ============ */

export interface Merchant {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
}

export const merchants: Merchant[] = [
  { id: 'm1', name: 'BPC', category: 'Electricity', icon: '⚡', color: '#F5A623' },
  { id: 'm2', name: 'Mascom', category: 'Airtime & Data', icon: '📶', color: '#2ECC71' },
  { id: 'm3', name: 'BTC', category: 'Internet', icon: '🌐', color: '#1E3A5F' },
  { id: 'm4', name: 'WUC', category: 'Water', icon: '💧', color: '#2ECC71' },
  { id: 'm5', name: 'Choppies', category: 'Groceries', icon: '🛒', color: '#FF6B4A' },
  { id: 'm6', name: 'DStv', category: 'TV', icon: '📺', color: '#6B3A8A' },
  { id: 'm7', name: 'Orange', category: 'Airtime & Data', icon: '📱', color: '#FF6B4A' },
  { id: 'm8', name: 'beMobile', category: 'Airtime & Data', icon: '📱', color: '#6B3A8A' },
];

export interface Utility {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  accountLabel: string;
  accountPlaceholder: string;
  savedAccount?: string;
}

export const utilities: Utility[] = [
  { id: 'u1', name: 'BPC', category: 'Electricity', icon: '⚡', color: '#F5A623', accountLabel: 'Meter number', accountPlaceholder: 'e.g. 123456789', savedAccount: '14085142801' },
  { id: 'u2', name: 'WUC', category: 'Water', icon: '💧', color: '#2ECC71', accountLabel: 'Account number', accountPlaceholder: 'e.g. 7712345', savedAccount: '7712345' },
  { id: 'u3', name: 'DStv', category: 'TV', icon: '📺', color: '#6B3A8A', accountLabel: 'Smartcard number', accountPlaceholder: 'e.g. 1234567890', savedAccount: '1234567890' },
  { id: 'u4', name: 'BTC', category: 'Internet', icon: '🌐', color: '#1E3A5F', accountLabel: 'Account number', accountPlaceholder: 'e.g. 99887766', savedAccount: '99887766' },
];

export interface AirtimeNetwork {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const airtimeNetworks: AirtimeNetwork[] = [
  { id: 'a1', name: 'Mascom', icon: '📶', color: '#2ECC71' },
  { id: 'a2', name: 'BTC', icon: '🌐', color: '#1E3A5F' },
  { id: 'a3', name: 'Orange', icon: '📱', color: '#FF6B4A' },
  { id: 'a4', name: 'beMobile', icon: '📱', color: '#6B3A8A' },
];

export interface DataBundle {
  id: string;
  provider: string;
  name: string;
  gb: number;
  price: number;
  validity: string;
  color: string;
}

export const dataBundles: DataBundle[] = [
  { id: 'd1', provider: 'Mascom', name: 'Daily 1GB', gb: 1, price: 15, validity: '24h', color: '#2ECC71' },
  { id: 'd2', provider: 'Mascom', name: 'Weekly 2GB', gb: 2, price: 30, validity: '7 days', color: '#2ECC71' },
  { id: 'd3', provider: 'Mascom', name: 'Monthly 5GB', gb: 5, price: 75, validity: '30 days', color: '#2ECC71' },
  { id: 'd4', provider: 'Mascom', name: 'Monthly 10GB', gb: 10, price: 150, validity: '30 days', color: '#2ECC71' },
  { id: 'd5', provider: 'BTC', name: 'Daily 1GB', gb: 1, price: 18, validity: '24h', color: '#1E3A5F' },
  { id: 'd6', provider: 'BTC', name: 'Monthly 8GB', gb: 8, price: 120, validity: '30 days', color: '#1E3A5F' },
  { id: 'd7', provider: 'Orange', name: 'Weekly 3GB', gb: 3, price: 45, validity: '7 days', color: '#FF6B4A' },
  { id: 'd8', provider: 'Orange', name: 'Monthly 6GB', gb: 6, price: 90, validity: '30 days', color: '#FF6B4A' },
];

/* ============ NFC STICKERS ============ */

export interface Sticker {
  id: string;
  name: string;
  serial: string;
  status: 'active' | 'frozen';
  lastUsed: string;
  uses: number;
}

export const stickers: Sticker[] = [
  { id: 's1', name: 'MyTap Sticker · Wallet', serial: 'MT-8821-4401', status: 'active', lastUsed: '2026-08-29T18:00:00', uses: 142 },
  { id: 's2', name: 'MyTap Sticker · Keys', serial: 'MT-7710-2293', status: 'frozen', lastUsed: '2026-08-20T12:00:00', uses: 58 },
];

/* ============ RECEIPTS ============ */

export interface Receipt {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  ref: string;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  icon: string;
  color: string;
}

export const receipts: Receipt[] = [
  { id: 'r1', merchant: 'BPC', category: 'Electricity', amount: 100, date: '2026-08-29T10:04:00', ref: 'MT-482913', method: 'MyTap Wallet', status: 'completed', icon: '⚡', color: '#F5A623' },
  { id: 'r2', merchant: 'Mascom', category: 'Data', amount: 5, date: '2026-08-29T11:32:00', ref: 'MT-482914', method: 'MyTap Wallet', status: 'completed', icon: '📶', color: '#2ECC71' },
  { id: 'r3', merchant: 'Choppies Phakalane', category: 'Transfer', amount: 278.59, date: '2026-08-29T16:48:00', ref: 'MT-482915', method: 'Mastercard', status: 'completed', icon: '🛒', color: '#FF6B4A' },
];

/* ============ SAVINGS / LOANS / INSURANCE / REWARDS ============ */

export interface SavingsGoal {
  id: string;
  name: string;
  icon: string;
  color: string;
  target: number;
  saved: number;
  monthly: number;
  deadline: string;
}

export const savingsGoals: SavingsGoal[] = [
  { id: 'g1', name: 'Emergency Fund', icon: '🛡️', color: '#2ECC71', target: 20000, saved: 12500, monthly: 1000, deadline: '2027-03-01' },
  { id: 'g2', name: 'New Phone', icon: '📱', color: '#1E3A5F', target: 8000, saved: 3200, monthly: 500, deadline: '2026-12-01' },
  { id: 'g3', name: 'Trip to Cape Town', icon: '✈️', color: '#FF6B4A', target: 15000, saved: 2100, monthly: 800, deadline: '2027-06-01' },
];

export interface Loan {
  id: string;
  name: string;
  amount: number;
  paid: number;
  interest: number;
  termMonths: number;
  nextPayment: string;
  status: 'active' | 'eligible';
  icon: string;
  color: string;
}

export const loans: Loan[] = [
  { id: 'l1', name: 'MyTap Personal Loan', amount: 50000, paid: 2100, interest: 8.5, termMonths: 12, nextPayment: '2026-09-10', status: 'active', icon: '💳', color: '#6B3A8A' },
  { id: 'l2', name: 'Salary Advance', amount: 2000, paid: 0, interest: 3.0, termMonths: 1, nextPayment: '2026-09-25', status: 'eligible', icon: '💵', color: '#2ECC71' },
];

export interface InsurancePolicy {
  id: string;
  name: string;
  type: string;
  premium: number;
  coverage: number;
  renews: string;
  status: 'active' | 'eligible';
  icon: string;
  color: string;
}

export const insurancePolicies: InsurancePolicy[] = [
  { id: 'i1', name: 'MyTap Phone Cover', type: 'Device', premium: 25, coverage: 5000, renews: '2026-10-01', status: 'active', icon: '📱', color: '#1E3A5F' },
  { id: 'i2', name: 'MyTap Life Cover', type: 'Life', premium: 120, coverage: 100000, renews: '2026-12-01', status: 'active', icon: '🛡️', color: '#2ECC71' },
  { id: 'i3', name: 'MyTap Travel Cover', type: 'Travel', premium: 0, coverage: 50000, renews: '—', status: 'eligible', icon: '✈️', color: '#FF6B4A' },
];

export interface Reward {
  id: string;
  title: string;
  points: number;
  icon: string;
  color: string;
  expires: string;
}

export const rewards: Reward[] = [
  { id: 'rw1', title: 'Choppies Cashback', points: 250, icon: '🛒', color: '#FF6B4A', expires: '2026-09-30' },
  { id: 'rw2', title: 'Fuel Rewards', points: 180, icon: '⛽', color: '#F5A623', expires: '2026-10-15' },
  { id: 'rw3', title: 'DStv Bonus', points: 120, icon: '📺', color: '#6B3A8A', expires: '2026-09-20' },
];

/* ============ NOTIFICATIONS ============ */

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  icon: string;
  color: string;
  read: boolean;
  type: 'payment' | 'security' | 'reward' | 'system';
}

export const notifications: AppNotification[] = [
  { id: 'n1', title: 'Payment successful', body: 'You paid P278.59 to Choppies Phakalane.', time: '2026-08-29T16:48:00', icon: '✅', color: '#2ECC71', read: false, type: 'payment' },
  { id: 'n2', title: 'Data usage alert', body: 'You have used 84% of your Mascom 10GB bundle.', time: '2026-08-29T12:00:00', icon: '📶', color: '#F5A623', read: false, type: 'system' },
  { id: 'n3', title: 'New reward earned', body: 'You earned 250 points at Choppies Phakalane.', time: '2026-08-29T16:50:00', icon: '🎁', color: '#6B3A8A', read: true, type: 'reward' },
  { id: 'n4', title: 'Security tip', body: 'Biometric login is now active on your device.', time: '2026-08-28T09:00:00', icon: '🔒', color: '#1E3A5F', read: true, type: 'security' },
];

/* ============ ACCOUNT ============ */

export const userProfile = {
  name: 'Tawanda',
  fullName: 'Tawanda Dominic Nyazorwe',
  phone: '+267 71 772 370',
  email: 'tawanda@mytap.bw',
  initials: 'TD',
  memberSince: '2024',
  tier: 'Gold',
  kyc: 'verified' as const,
  address: 'Gaborone, Botswana',
  idNumber: 'BW-1987-XXXX',
};

export const guardrail = { monthlyLimit: 10000, used: 4120, pct: 41 };

export const aiSuggestions = [
  'How much did I spend on groceries?',
  'When does my data expire?',
  "What's my remaining balance?",
];

export const faqs = [
  { q: 'How do I add money to my MyTap Wallet?', a: 'Go to Cards & Wallets, tap your wallet, then choose "Add money". You can top up from a linked bank account or another card.' },
  { q: 'How do I freeze a lost card?', a: 'Open Cards & Wallets, tap the card, and press "Freeze". The card is blocked instantly and you can unfreeze it anytime.' },
  { q: 'How does the NFC sticker work?', a: 'Tap your MyTap sticker on any NFC-enabled payment terminal to pay. You can freeze a sticker from the Stickers screen.' },
  { q: 'How do I set a spending limit?', a: 'Open Guardrail, enter your monthly limit, and save. We will alert you as you approach it.' },
  { q: 'Is my money safe?', a: 'Yes. MyTap uses bank-grade encryption, biometric login, and real-time fraud monitoring to keep your money safe.' },
];
