import React, { createContext, useContext, useReducer } from 'react';
import { cards as seedCards, transactions as seedTx, tariff as seedTariff, stickers as seedStickers } from '../data/mock';

export interface AppState {
  cards: typeof seedCards;
  transactions: typeof seedTx;
  tariff: typeof seedTariff;
  stickers: typeof seedStickers;
  monthlyLimit: number;
}

type Action =
  | { type: 'ADD_MONEY'; cardId: string; amount: number }
  | { type: 'TOGGLE_FREEZE'; cardId: string }
  | { type: 'PAY'; cardId: string; amount: number; merchant: string; category: string; icon: string; color: string }
  | { type: 'ADD_BUNDLE'; gb: number }
  | { type: 'TOGGLE_STICKER'; stickerId: string }
  | { type: 'SET_LIMIT'; limit: number };

const initialState: AppState = {
  cards: seedCards,
  transactions: seedTx,
  tariff: seedTariff,
  stickers: seedStickers,
  monthlyLimit: 10000,
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
      const card = state.cards.find((c) => c.id === action.cardId);
      if (!card) return state;
      const tx = {
        id: `tx-${Date.now()}`,
        merchant: action.merchant,
        category: action.category,
        amount: -action.amount,
        date: new Date().toISOString().slice(0, 10),
        icon: action.icon,
        color: action.color,
      };
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.cardId ? { ...c, balance: c.balance - action.amount } : c
        ),
        transactions: [tx, ...state.transactions],
      };
    case 'ADD_BUNDLE':
      return {
        ...state,
        tariff: {
          ...state.tariff,
          totalGB: state.tariff.totalGB + action.gb,
          leftGB: state.tariff.leftGB + action.gb,
          usedPct: Math.round((state.tariff.usedGB / (state.tariff.totalGB + action.gb)) * 100),
        },
      };
    case 'TOGGLE_STICKER':
      return {
        ...state,
        stickers: state.stickers.map((s) =>
          s.id === action.stickerId
            ? { ...s, status: s.status === 'active' ? 'frozen' : 'active' }
            : s
        ),
      };
    case 'SET_LIMIT':
      return { ...state, monthlyLimit: action.limit };
    default:
      return state;
  }
}

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> }>({
  state: initialState,
  dispatch: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
