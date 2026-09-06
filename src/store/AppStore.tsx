import React, { createContext, useContext, useMemo, useReducer } from 'react';
import {
  guardrail as guardrailSeed,
  tariff as tariffSeed,
  transactions as txSeed,
  walletCards as cardsSeed,
  WalletCard,
  Transaction,
  Tariff,
  Sticker,
  stickers as stickersSeed,
  Receipt,
  receipts as receiptsSeed,
  SavingsGoal,
  savingsGoals as goalsSeed,
  Loan,
  loans as loansSeed,
  InsurancePolicy,
  insurancePolicies as insuranceSeed,
  Reward,
  rewards as rewardsSeed,
  AppNotification,
  notifications as notifSeed,
  DataHistory,
  dataHistory as dataHistorySeed,
} from '../data/mock';

export interface AppState {
  cards: WalletCard[];
  transactions: Transaction[];
  tariff: Tariff;
  stickers: Sticker[];
  guardrail: { monthlyLimit: number; used: number; pct: number };
  receipts: Receipt[];
  savingsGoals: SavingsGoal[];
  loans: Loan[];
  insurance: InsurancePolicy[];
  rewards: Reward[];
  notifications: AppNotification[];
  dataHistory: DataHistory[];
  biometricEnabled: boolean;
  pin: string;
  totalPoints: number;
}

type Action =
  | { type: 'ADD_MONEY'; cardId: string; amount: number }
  | { type: 'TOGGLE_FREEZE'; cardId: string }
  | { type: 'PAY'; cardId: string; amount: number; merchant: string; category: string; icon: string; color: string; method?: string }
  | { type: 'ADD_BUNDLE'; gb: number }
  | { type: 'TOGGLE_STICKER'; stickerId: string }
  | { type: 'SET_GUARDRAIL'; limit: number }
  | { type: 'ADD_RECEIPT'; receipt: Receipt }
  | { type: 'ADD_GOAL'; goal: SavingsGoal }
  | { type: 'CONTRIBUTE_GOAL'; goalId: string; amount: number }
  | { type: 'TOGGLE_AUTO_RENEW' }
  | { type: 'BUY_DATA'; bundle: { gb: number; price: number; name: string; provider: string } }
  | { type: 'MARK_NOTIF_READ'; id: string }
  | { type: 'MARK_ALL_NOTIF_READ' }
  | { type: 'SET_BIOMETRIC'; enabled: boolean }
  | { type: 'SET_PIN'; pin: string }
  | { type: 'ADD_POINTS'; points: number }
  | { type: 'REDEEM_POINTS'; points: number };

const initialState: AppState = {
  cards: cardsSeed,
  transactions: txSeed,
  tariff: tariffSeed,
  stickers: stickersSeed,
  guardrail: guardrailSeed,
  receipts: receiptsSeed,
  savingsGoals: goalsSeed,
  loans: loansSeed,
  insurance: insuranceSeed,
  rewards: rewardsSeed,
  notifications: notifSeed,
  dataHistory: dataHistorySeed,
  biometricEnabled: false,
  pin: '1234',
  totalPoints: 1250,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_MONEY':
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.cardId ? { ...c, balance: c.balance + action.amount } : c
        ),
      };
    case 'TOGGLE_FREEZE':
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.cardId ? { ...c, frozen: !c.frozen } : c
        ),
      };
    case 'PAY': {
      const tx: Transaction = {
        id: `tx-${Date.now()}`,
        merchant: action.merchant,
        category: action.category,
        amount: -action.amount,
        date: new Date().toISOString(),
        icon: action.icon,
        color: action.color,
        status: 'completed',
        method: action.method || 'MyTap Wallet',
        ref: `MT-${Math.floor(100000 + Math.random() * 900000)}`,
      };
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.cardId ? { ...c, balance: c.balance - action.amount } : c
        ),
        transactions: [tx, ...state.transactions],
        guardrail: {
          ...state.guardrail,
          used: Math.min(state.guardrail.monthlyLimit, state.guardrail.used + action.amount),
        },
      };
    }
    case 'ADD_BUNDLE': {
      const total = state.tariff.totalGB + action.gb;
      return {
        ...state,
        tariff: {
          ...state.tariff,
          totalGB: total,
          usedGB: state.tariff.usedGB,
          leftGB: total - state.tariff.usedGB,
          usedPct: Math.round((state.tariff.usedGB / total) * 100),
        },
      };
    }
    case 'TOGGLE_STICKER':
      return {
        ...state,
        stickers: state.stickers.map((s) =>
          s.id === action.stickerId
            ? { ...s, status: s.status === 'active' ? 'frozen' : 'active' }
            : s
        ),
      };
    case 'SET_GUARDRAIL':
      return {
        ...state,
        guardrail: {
          monthlyLimit: action.limit,
          used: state.guardrail.used,
          pct: Math.min(100, Math.round((state.guardrail.used / action.limit) * 100)),
        },
      };
    case 'ADD_RECEIPT':
      return { ...state, receipts: [action.receipt, ...state.receipts] };
    case 'ADD_GOAL':
      return { ...state, savingsGoals: [...state.savingsGoals, action.goal] };
    case 'CONTRIBUTE_GOAL':
      return {
        ...state,
        savingsGoals: state.savingsGoals.map((g) =>
          g.id === action.goalId
            ? { ...g, saved: Math.min(g.target, g.saved + action.amount) }
            : g
        ),
      };
    case 'TOGGLE_AUTO_RENEW':
      return { ...state, tariff: { ...state.tariff, autoRenew: !state.tariff.autoRenew } };
    case 'BUY_DATA': {
      const total = state.tariff.totalGB + action.bundle.gb;
      return {
        ...state,
        tariff: {
          ...state.tariff,
          totalGB: total,
          leftGB: total - state.tariff.usedGB,
          usedPct: Math.round((state.tariff.usedGB / total) * 100),
        },
        dataHistory: [
          {
            id: `dh-${Date.now()}`,
            bundle: action.bundle.name,
            gb: action.bundle.gb,
            price: action.bundle.price,
            date: new Date().toISOString(),
            status: 'active',
          },
          ...state.dataHistory,
        ],
      };
    }
    case 'MARK_NOTIF_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.id ? { ...n, read: true } : n
        ),
      };
    case 'MARK_ALL_NOTIF_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };
    case 'SET_BIOMETRIC':
      return { ...state, biometricEnabled: action.enabled };
    case 'SET_PIN':
      return { ...state, pin: action.pin };
    case 'ADD_POINTS':
      return { ...state, totalPoints: state.totalPoints + action.points };
    case 'REDEEM_POINTS':
      return { ...state, totalPoints: Math.max(0, state.totalPoints - action.points) };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextValue>({ state: initialState, dispatch: () => {} });

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
