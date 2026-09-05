# MyTap — Botswana Digital Wallet & Financial Services

A premium, Botswana-focused digital wallet and financial services app built with
**React Native + Expo + Expo Router + TypeScript**, powered by **React Native
Reanimated 3**, **React Native Gesture Handler**, and **Expo Haptics**.

> Runs entirely in **Expo Go** — no native build required.

---

## ✨ Features

- **Home** — premium dashboard with typewriter greeting, swipeable wallet cards
  (spring physics, active 1.02× / adjacent 0.92×), MyTap Day reward card, quick actions.
- **Cards** — all payment methods (MyTap Wallet, Mastercard, MyZaka), 3D flip,
  freeze/unfreeze toggle, add-money modal.
- **Pay** — payment hub with Botswana merchants (BPC, Mascom, BTC, WUC, Choppies…),
  full payment flow: button pulse → 800ms processing spinner → success green pulse +
  checkmark spring + confetti → receipt slide-up → balance count-up.
- **Tariff** — animated circular progress ring (green → yellow → red), usage breakdown,
  insights, add-bundle.
- **Sticker** — NFC sticker management with 3D tilt visual, activate/freeze, activity log.
- **More** — profile, security, settings, sign out.
- **Guardrail** — spending limits & financial wellness.
- **AI Assistant** — mock chat for financial insights.

### Design system
- Signature gradient `#0F1729 → #1E3A5F`; card gradients for MyTap Wallet, Mastercard, MyZaka.
- Accents: Coral `#FF6B4A`, Gold `#F5A623`, Deep Purple `#6B3A8A`, Emerald `#2ECC71`.
- Glassmorphism (`rgba(255,255,255,0.08)` bg, `0.12` border, 20–40px blur).
- Inter type scale (Hero 48pt → Small 10pt), 4px grid, Subtle→Hero shadow system.
- Dark / light mode, water-bubble shimmer, 3D floating, "MyTap Glow".

### Animations
Water bubble (6s shimmer), spring physics (damping 0.8 / stiffness 100 / mass 0.8),
card swipe + 3D tilt, tab crossfade 300ms, modal slide-up 400ms spring, payment success
confetti, number count-up/down (400ms, emerald/coral glow), pull-to-refresh glass spinner,
2s skeleton shimmer, staggered entry, haptics everywhere.

---

## 🚀 Getting started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm
- The **Expo Go** app on your phone (iOS App Store / Android Play Store), or an emulator

### 1. Install
```bash
npm install
```

### 2. Run
```bash
npx expo start
```
Then scan the QR code with **Expo Go** (Android) or the Camera app (iOS).

> Tip: press `a` to open on an Android emulator, `i` for iOS simulator, `w` for web.

### 3. Type-check (optional)
```bash
npm run typecheck
```

---

## 🗂 Project structure

```
mytap/
├── app/                    # Expo Router routes
│   ├── _layout.tsx         # Root providers (theme, store, toast, gestures)
│   ├── (tabs)/             # Tab navigator
│   │   ├── _layout.tsx     # Custom glassmorphism bottom tab bar
│   │   ├── index.tsx       # Home
│   │   ├── cards.tsx       # Cards
│   │   ├── pay.tsx         # Pay
│   │   ├── tariff.tsx      # Tariff
│   │   ├── sticker.tsx     # Sticker
│   │   └── more.tsx        # More
│   ├── guardrail.tsx       # Guardrail (stack route)
│   └── assistant.tsx       # AI Assistant (stack route)
├── src/
│   ├── theme/              # Colors, typography, spacing, shadows, ThemeContext
│   ├── components/
│   │   ├── animations/     # WaterBubble, CountUp, Skeleton, Staggered, Typewriter, Confetti
│   │   ├── cards/          # WalletCardView, CardCarousel, GlassCard, TiltCard
│   │   └── ui/             # Button, ProgressRing, ScreenContainer, BottomTabBar, Modal, Toast
│   ├── data/               # Botswana-specific mock data
│   ├── store/              # App state (wallet, transactions, tariff, stickers, guardrail)
│   └── utils/              # format, haptics
├── assets/                 # App icons
└── scripts/                # Icon generation
```

---

## 🧾 Mock data (Botswana)

| Card | Balance | Last 4 |
|------|---------|--------|
| MyTap Wallet | P3,553.77 | •••• 3321 |
| Mastercard | P3,877.00 | •••• 1190 |
| MyZaka Card | P1,200.00 | •••• 4455 |

Transactions: BPC · Airtime · −P100.00 · 29 Aug · Mascom · Data · −P5.00 · 29 Aug ·
Choppies · Groceries · −P278.59 · 29 Aug.

Tariff: Mascom Connect 10GB · 84% used · 1.6GB left · Renews 30 Aug.

---

## 📦 Tech stack
- React Native 0.76 · Expo SDK 52 · Expo Router 5
- TypeScript (strict)
- React Native Reanimated 3 · React Native Gesture Handler
- Expo Haptics · expo-blur · expo-linear-gradient · react-native-svg
- @expo-google-fonts/inter

## 📄 License
Private / demo project.