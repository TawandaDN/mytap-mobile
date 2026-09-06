/**
 * MyTap mock data — Botswana-specific.
 */

export interface WalletCard {
  id: string;
  name: string;
  balance: number;
  last4: string;
  gradient: readonly [string, string, string];
  type: 'wallet' | 'mastercard' | 'myzaka';
  frozen?: boolean;
  virtual?: boolean;
  limit?: number;
  expiry: string;
  cvv: string;
  pin: string;
}

export const walletCards: WalletCard[] = [
  { id: 'wallet', name: 'MyTap Wallet', balance: 3553.77, last4: '3321', gradient: ['#1A2A4A', '#2D3B6B', '#FF6B4A'], type: 'wallet', expiry: '09/29', cvv: '482', pin: '3321', limit: 5000 },
  { id: 'mastercard', name: 'Mastercard', balance: 3877.0, last4: '1190', gradient: ['#2D3B6B', '#4A6A8A', '#F5A623'], type: 'mastercard', expiry: '11/28', cvv: '731', pin: '1190', limit: 10000 },
  { id: 'myzaka', name: 'MyZaka Card', balance: 1200.0, last4: '4455', gradient: ['#1A2A4A', '#3D2B6B', '#8A4A9A'], type: 'myzaka', expiry: '03/30', cvv: '205', pin: '4455', limit: 3000 },
];

export interface Transaction {
  id: string; merchant: string; category: string; amount: number; date: string; icon: string; color: string;
  status?: 'completed' | 'pending' | 'failed'; ref?: string; method?: string;
}

export const transactions: Transaction[] = [
  { id: 't1', merchant: 'BPC', category: 'Electricity', amount: -100.0, date: '2026-08-29T10:00:00', icon: '⚡', color: '#F5A623', status: 'completed', ref: 'MT-482913', method: 'MyTap Wallet' },
  { id: 't2', merchant: 'Mascom', category: 'Data', amount: -5.0, date: '2026-08-29T11:30:00', icon: '📶', color: '#2ECC71', status: 'completed', ref: 'MT-482914', method: 'MyTap Wallet' },
  { id: 't3', merchant: 'Choppies', category: 'Groceries', amount: -278.59, date: '2026-08-29T16:45:00', icon: '🛒', color: '#FF6B4A', status: 'completed', ref: 'MT-482915', method: 'Mastercard' },
  { id: 't4', merchant: 'DStv', category: 'TV', amount: -349.0, date: '2026-08-28T09:15:00', icon: '📺', color: '#6B3A8A', status: 'completed', ref: 'MT-482800', method: 'MyTap Wallet' },
  { id: 't5', merchant: 'WUC', category: 'Water', amount: -85.5, date: '2026-08-27T14:20:00', icon: '💧', color: '#1ABC9C', status: 'completed', ref: 'MT-482701', method: 'MyTap Wallet' },
  { id: 't6', merchant: 'Salary', category: 'Income', amount: 8500.0, date: '2026-08-25T08:00:00', icon: '💰', color: '#2ECC71', status: 'completed', ref: 'MT-482500', method: 'Bank Transfer' },
  { id: 't7', merchant: 'Shoprite', category: 'Groceries', amount: -412.3, date: '2026-08-24T14:10:00', icon: '🛒', color: '#FF6B4A', status: 'completed', ref: 'MT-482400', method: 'MyZaka Card' },
  { id: 't8', merchant: 'BTC', category: 'Internet', amount: -599.0, date: '2026-08-22T11:00:00', icon: '🌐', color: '#3498DB', status: 'completed', ref: 'MT-482200', method: 'MyTap Wallet' },
  { id: 't9', merchant: 'Orange', category: 'Airtime', amount: -30.0, date: '2026-08-20T19:45:00', icon: '📱', color: '#E67E22', status: 'completed', ref: 'MT-482000', method: 'MyTap Wallet' },
  { id: 't10', merchant: 'KFC', category: 'Dining', amount: -89.9, date: '2026-08-19T13:30:00', icon: '🍗', color: '#E74C3C', status: 'completed', ref: 'MT-481900', method: 'Mastercard' },
  { id: 't11', merchant: 'beMobile', category: 'Airtime', amount: -25.0, date: '2026-08-18T10:20:00', icon: '📱', color: '#8E44AD', status: 'completed', ref: 'MT-481800', method: 'MyTap Wallet' },
  { id: 't12', merchant: 'Pula Fuel', category: 'Transport', amount: -650.0, date: '2026-08-16T17:00:00', icon: '⛽', color: '#F5A623', status: 'completed', ref: 'MT-481600', method: 'Mastercard' },
];

export interface Tariff { id: string; provider: string; name: string; totalGB: number; usedGB: number; leftGB: number; usedPct: number; renews: string; color: string; autoRenew: boolean; }
export const tariff: Tariff = { id: 'mascom-connect', provider: 'Mascom', name: 'Mascom Connect 10GB', totalGB: 10, usedGB: 8.4, leftGB: 1.6, usedPct: 84, renews: '2026-08-30T00:00:00', color: '#2ECC71', autoRenew: true };

export interface Merchant { id: string; name: string; category: string; icon: string; color: string; }
export const merchants: Merchant[] = [
  { id: 'm1', name: 'BPC', category: 'Electricity', icon: '⚡', color: '#F5A623' },
  { id: 'm2', name: 'Mascom', category: 'Airtime & Data', icon: '📶', color: '#2ECC71' },
  { id: 'm3', name: 'BTC', category: 'Internet', icon: '🌐', color: '#3498DB' },
  { id: 'm4', name: 'WUC', category: 'Water', icon: '💧', color: '#1ABC9C' },
  { id: 'm5', name: 'Choppies', category: 'Groceries', icon: '🛒', color: '#FF6B4A' },
  { id: 'm6', name: 'DStv', category: 'TV', icon: '📺', color: '#6B3A8A' },
  { id: 'm7', name: 'Orange', category: 'Airtime & Data', icon: '📱', color: '#E67E22' },
  { id: 'm8', name: 'beMobile', category: 'Airtime & Data', icon: '📱', color: '#8E44AD' },
];

export interface Sticker { id: string; name: string; serial: string; status: 'active' | 'frozen'; lastUsed: string; uses: number; }
export const stickers: Sticker[] = [
  { id: 's1', name: 'MyTap Sticker · Wallet', serial: 'MT-8821-4401', status: 'active', lastUsed: '2026-08-29T18:00:00', uses: 142 },
  { id: 's2', name: 'MyTap Sticker · Keys', serial: 'MT-7710-2293', status: 'frozen', lastUsed: '2026-08-20T12:00:00', uses: 58 },
];

export const userProfile = { name: 'Tawanda', fullName: 'Tawanda Moko', phone: '+267 71 234 567', email: 'tawanda@mytap.bw', memberSince: '2024', tier: 'Gold', kyc: 'verified', address: 'Gaborone, Botswana', idNumber: 'BW-1987-XXXX' };
export const guardrail = { monthlyLimit: 10000, used: 4120, pct: 41 };
export const aiSuggestions = ['How much did I spend on groceries this month?', 'Should I top up my MyTap Wallet?', 'Show me my data usage', 'Set a spending limit for next month'];

export interface Receipt { id: string; merchant: string; category: string; amount: number; date: string; ref: string; method: string; status: 'completed' | 'pending' | 'failed'; icon: string; color: string; }
export const receipts: Receipt[] = [
  { id: 'r1', merchant: 'BPC', category: 'Electricity', amount: 100, date: '2026-08-29T10:00:00', ref: 'MT-482913', method: 'MyTap Wallet', status: 'completed', icon: '⚡', color: '#F5A623' },
  { id: 'r2', merchant: 'Mascom', category: 'Data', amount: 5, date: '2026-08-29T11:30:00', ref: 'MT-482914', method: 'MyTap Wallet', status: 'completed', icon: '📶', color: '#2ECC71' },
  { id: 'r3', merchant: 'Choppies', category: 'Groceries', amount: 278.59, date: '2026-08-29T16:45:00', ref: 'MT-482915', method: 'Mastercard', status: 'completed', icon: '🛒', color: '#FF6B4A' },
];

export interface Utility { id: string; name: string; category: string; icon: string; color: string; accountLabel: string; accountPlaceholder: string; savedAccount?: string; }
export const utilities: Utility[] = [
  { id: 'u1', name: 'BPC', category: 'Electricity', icon: '⚡', color: '#F5A623', accountLabel: 'Meter number', accountPlaceholder: 'e.g. 123456789', savedAccount: '482913' },
  { id: 'u2', name: 'WUC', category: 'Water', icon: '💧', color: '#1ABC9C', accountLabel: 'Account number', accountPlaceholder: 'e.g. 7712345', savedAccount: '7712345' },
  { id: 'u3', name: 'DStv', category: 'TV', icon: '📺', color: '#6B3A8A', accountLabel: 'Smartcard number', accountPlaceholder: 'e.g. 1234567890', savedAccount: '1234567890' },
  { id: 'u4', name: 'BTC', category: 'Internet', icon: '🌐', color: '#3498DB', accountLabel: 'Account number', accountPlaceholder: 'e.g. 99887766', savedAccount: '99887766' },
];

export interface AirtimeNetwork { id: string; name: string; icon: string; color: string; }
export const airtimeNetworks: AirtimeNetwork[] = [
  { id: 'a1', name: 'Mascom', icon: '📶', color: '#2ECC71' },
  { id: 'a2', name: 'BTC', icon: '🌐', color: '#3498DB' },
  { id: 'a3', name: 'Orange', icon: '📱', color: '#E67E22' },
  { id: 'a4', name: 'beMobile', icon: '📱', color: '#8E44AD' },
];

export interface DataBundle { id: string; provider: string; name: string; gb: number; price: number; validity: string; color: string; }
export const dataBundles: DataBundle[] = [
  { id: 'd1', provider: 'Mascom', name: 'Daily 1GB', gb: 1, price: 15, validity: '24h', color: '#2ECC71' },
  { id: 'd2', provider: 'Mascom', name: 'Weekly 2GB', gb: 2, price: 30, validity: '7 days', color: '#2ECC71' },
  { id: 'd3', provider: 'Mascom', name: 'Monthly 5GB', gb: 5, price: 75, validity: '30 days', color: '#2ECC71' },
  { id: 'd4', provider: 'Mascom', name: 'Monthly 10GB', gb: 10, price: 150, validity: '30 days', color: '#2ECC71' },
  { id: 'd5', provider: 'BTC', name: 'Daily 1GB', gb: 1, price: 18, validity: '24h', color: '#3498DB' },
  { id: 'd6', provider: 'BTC', name: 'Monthly 8GB', gb: 8, price: 120, validity: '30 days', color: '#3498DB' },
  { id: 'd7', provider: 'Orange', name: 'Weekly 3GB', gb: 3, price: 45, validity: '7 days', color: '#E67E22' },
  { id: 'd8', provider: 'Orange', name: 'Monthly 6GB', gb: 6, price: 90, validity: '30 days', color: '#E67E22' },
];

export interface DataHistory { id: string; bundle: string; gb: number; price: number; date: string; status: 'active' | 'expired'; }
export const dataHistory: DataHistory[] = [
  { id: 'dh1', bundle: 'Mascom Connect 10GB', gb: 10, price: 150, date: '2026-07-30T00:00:00', status: 'active' },
  { id: 'dh2', bundle: 'Mascom Weekly 2GB', gb: 2, price: 30, date: '2026-07-15T00:00:00', status: 'expired' },
  { id: 'dh3', bundle: 'Mascom Daily 1GB', gb: 1, price: 15, date: '2026-07-02T00:00:00', status: 'expired' },
];

export interface SavingsGoal { id: string; name: string; icon: string; color: string; target: number; saved: number; monthly: number; deadline: string; }
export const savingsGoals: SavingsGoal[] = [
  { id: 'g1', name: 'Emergency Fund', icon: '🛡️', color: '#2ECC71', target: 20000, saved: 12500, monthly: 1000, deadline: '2027-03-01' },
  { id: 'g2', name: 'New Phone', icon: '📱', color: '#3498DB', target: 8000, saved: 3200, monthly: 500, deadline: '2026-12-01' },
  { id: 'g3', name: 'Trip to Cape Town', icon: '✈️', color: '#FF6B4A', target: 15000, saved: 2100, monthly: 800, deadline: '2027-06-01' },
];

export interface Loan { id: string; name: string; amount: number; paid: number; interest: number; termMonths: number; nextPayment: string; status: 'active' | 'eligible'; icon: string; color: string; }
export const loans: Loan[] = [
  { id: 'l1', name: 'MyTap Personal Loan', amount: 50000, paid: 2100, interest: 8.5, termMonths: 12, nextPayment: '2026-09-10', status: 'active', icon: '💳', color: '#6B3A8A' },
  { id: 'l2', name: 'Salary Advance', amount: 2000, paid: 0, interest: 3.0, termMonths: 1, nextPayment: '2026-09-25', status: 'eligible', icon: '💰', color: '#2ECC71' },
];

export interface InsurancePolicy { id: string; name: string; type: string; premium: number; coverage: number; renews: string; status: 'active' | 'eligible'; icon: string; color: string; }
export const insurancePolicies: InsurancePolicy[] = [
  { id: 'i1', name: 'MyTap Phone Cover', type: 'Device', premium: 25, coverage: 5000, renews: '2026-10-01', status: 'active', icon: '📱', color: '#3498DB' },
  { id: 'i2', name: 'MyTap Life Cover', type: 'Life', premium: 120, coverage: 100000, renews: '2026-12-01', status: 'active', icon: '🛡️', color: '#2ECC71' },
  { id: 'i3', name: 'MyTap Travel Cover', type: 'Travel', premium: 0, coverage: 50000, renews: '—', status: 'eligible', icon: '✈️', color: '#FF6B4A' },
];

export interface Reward { id: string; title: string; points: number; icon: string; color: string; expires: string; }
export const rewards: Reward[] = [
  { id: 'rw1', title: 'Choppies Cashback', points: 250, icon: '🛒', color: '#FF6B4A', expires: '2026-09-30' },
  { id: 'rw2', title: 'Fuel Rewards', points: 180, icon: '⛽', color: '#F5A623', expires: '2026-10-15' },
  { id: 'rw3', title: 'DStv Bonus', points: 120, icon: '📺', color: '#6B3A8A', expires: '2026-09-20' },
];

export interface AppNotification { id: string; title: string; body: string; time: string; icon: string; color: string; read: boolean; type: 'payment' | 'security' | 'reward' | 'system'; }
export const notifications: AppNotification[] = [
  { id: 'n1', title: 'Payment successful', body: 'You paid P288.59 to Choppies.', time: '2026-08-29T16:45:00', icon: '✅', color: '#2ECC71', read: false, type: 'payment' },
  { id: 'n2', title: 'Data usage alert', body: 'You have used 84% of your Mascom 10GB bundle.', time: '2026-08-29T12:00:00', icon: '📶', color: '#F5A623', read: false, type: 'system' },
  { id: 'n3', title: 'New reward earned', body: 'You earned 250 points at Choppies.', time: '2026-08-29T16:50:00', icon: '🎁', color: '#6B3A8A', read: true, type: 'payment' },
  { id: 'n4', title: 'Security tip', body: 'Biometric login is now active on your device.', time: '2026-08-28T09:00:00', icon: '🔒', color: '#3498DB', read: true, type: 'security' },
];

export interface Contact { id: string; name: string; phone: string; avatarColor: string; recent?: boolean; }
export const contacts: Contact[] = [
  { id: 'c1', name: 'Kabelo M.', phone: '+267 72 111 222', avatarColor: '#2ECC71', recent: true },
  { id: 'c2', name: 'Thabo N.', phone: '+267 73 333 444', avatarColor: '#3498DB', recent: true },
  { id: 'c3', name: 'Lerato K.', phone: '+267 74 555 666', avatarColor: '#FF6B4A', recent: true },
  { id: 'c4', name: 'Odirile S.', phone: '+267 75 777 888', avatarColor: '#6B3A8A' },
  { id: 'c5', name: 'Goitse P.', phone: '+267 76 999 000', avatarColor: '#F5A623' },
];

export const faqs = [
  { q: 'How do I add money to my MyTap Wallet?', a: 'Go to the Cards tab, tap your wallet, then choose "Add money". You can top up from a linked bank account or another card.' },
  { q: 'How do I freeze a lost card?', a: 'Open the Cards tab, tap the card, and press "Freeze". The card will be blocked instantly and you can unfreeze it anytime.' },
  { q: 'How does the NFC sticker work?', a: 'Tap your MyTap sticker on any NFC-enabled payment terminal to pay. You can freeze a sticker from the Sticker tab.' },
  { q: 'How do I set a spending limit?', a: 'Open Guardrail from the More tab, enter your monthly limit, and save. We will alert you as you approach it.' },
  { q: 'Is my money safe?', a: 'Yes. MyTap uses bank-grade encryption, biometric login, and real-time fraud monitoring to keep your money safe.' },
];