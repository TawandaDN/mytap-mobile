import React from 'react';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

/**
 * 3D illustration set.
 *
 * Drawn as vectors so they stay razor-sharp at any size and ship as plain
 * source. Each piece is shaded the same way — a soft cast shadow, a body
 * gradient catching light from the top-left, a specular highlight and a
 * darker inner shade at the base — so the whole set reads as one family of
 * premium, softly lit materials.
 *
 * Palette follows the MyTap card gradients: navy, coral, gold, purple, emerald.
 */

export type IllustrationKey =
  | 'wallet'
  | 'success'
  | 'coins'
  | 'onboarding'
  | 'cardVirtual'
  | 'cardMetal'
  | 'shield';

const P = {
  navy: '#0F1729',
  navyMid: '#1E3A5F',
  navySoft: '#2D3B6B',
  coral: '#FF6B4A',
  gold: '#F5A623',
  emerald: '#2ECC71',
  purple: '#8A4A9A',
} as const;

function Cast({
  id,
  cx = 100,
  cy = 176,
  rx = 58,
  ry = 11,
}: {
  id: string;
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
}) {
  return (
    <>
      <Defs>
        <RadialGradient id={`${id}-cast`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={P.navy} stopOpacity="0.28" />
          <Stop offset="0.6" stopColor={P.navy} stopOpacity="0.1" />
          <Stop offset="1" stopColor={P.navy} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id}-cast)`} />
    </>
  );
}

/* ============ WALLET ============ */

function Wallet() {
  const id = 'ill-wallet';
  return (
    <>
      <Defs>
        <LinearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#3A4E78" />
          <Stop offset="0.55" stopColor={P.navyMid} />
          <Stop offset="1" stopColor="#141F36" />
        </LinearGradient>
        <LinearGradient id={`${id}-flap`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#6B7CA6" />
          <Stop offset="1" stopColor="#33456B" />
        </LinearGradient>
        <LinearGradient id={`${id}-clip`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#E8ECF3" />
          <Stop offset="1" stopColor="#9AA6BC" />
        </LinearGradient>
        <LinearGradient id={`${id}-coinA`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFA98F" />
          <Stop offset="1" stopColor={P.coral} />
        </LinearGradient>
        <LinearGradient id={`${id}-coinB`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFD98A" />
          <Stop offset="1" stopColor={P.gold} />
        </LinearGradient>
        <LinearGradient id={`${id}-coinC`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#8CF0B8" />
          <Stop offset="1" stopColor={P.emerald} />
        </LinearGradient>
      </Defs>

      <Cast id={id} />
      <Ellipse cx="100" cy="182" rx="30" ry="7" fill={P.navy} opacity="0.08" />

      <G>
        <Rect x="34" y="86" width="132" height="76" rx="18" fill={`url(#${id}-body)`} />
        <Rect x="34" y="86" width="132" height="30" rx="15" fill={`url(#${id}-flap)`} opacity="0.95" />
        <Rect x="46" y="100" width="62" height="12" rx="6" fill="#0B1424" opacity="0.55" />
        <Rect x="46" y="118" width="50" height="10" rx="5" fill="#0B1424" opacity="0.4" />
        <Rect x="46" y="140" width="108" height="2" rx="1" fill="#FFFFFF" opacity="0.1" />
        <Rect x="128" y="104" width="30" height="26" rx="10" fill={`url(#${id}-clip)`} />
        <Circle cx="143" cy="117" r="4" fill="#5A6A85" opacity="0.85" />
        <Rect x="42" y="92" width="116" height="8" rx="4" fill="#FFFFFF" opacity="0.16" />
      </G>

      <G>
        <Circle cx="86" cy="52" r="17" fill={`url(#${id}-coinA)`} />
        <Ellipse cx="86" cy="47" rx="12" ry="5" fill="#FFFFFF" opacity="0.35" />
        <Circle cx="124" cy="38" r="15" fill={`url(#${id}-coinB)`} />
        <Ellipse cx="124" cy="33" rx="10" ry="4.5" fill="#FFFFFF" opacity="0.4" />
        <Circle cx="150" cy="66" r="14" fill={`url(#${id}-coinC)`} />
        <Ellipse cx="150" cy="61" rx="9.5" ry="4" fill="#FFFFFF" opacity="0.36" />
      </G>
    </>
  );
}

/* ============ SUCCESS ============ */

function Success() {
  const id = 'ill-success';
  return (
    <>
      <Defs>
        <RadialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={P.emerald} stopOpacity="0.32" />
          <Stop offset="1" stopColor={P.emerald} stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#6FE4A0" />
          <Stop offset="0.5" stopColor={P.emerald} />
          <Stop offset="1" stopColor="#128A4C" />
        </LinearGradient>
      </Defs>

      <Circle cx="100" cy="94" r="76" fill={`url(#${id}-glow)`} />
      <Cast id={id} />
      <Ellipse cx="100" cy="164" rx="46" ry="12" fill="#128A4C" opacity="0.28" />

      <Rect x="48" y="44" width="104" height="104" rx="34" fill={`url(#${id}-body)`} />
      <Rect x="48" y="44" width="104" height="46" rx="30" fill="#FFFFFF" opacity="0.16" />
      <Path
        d="M74 98 L92 116 L128 78"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

/* ============ COINS ============ */

function Coins() {
  const id = 'ill-coins';
  return (
    <>
      <Defs>
        <LinearGradient id={`${id}-g1`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFE08A" />
          <Stop offset="1" stopColor={P.gold} />
        </LinearGradient>
        <LinearGradient id={`${id}-g2`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFB39C" />
          <Stop offset="1" stopColor={P.coral} />
        </LinearGradient>
      </Defs>
      <Cast id={id} />

      <Ellipse cx="78" cy="146" rx="34" ry="12" fill="#C98A12" />
      <Rect x="44" y="132" width="68" height="14" fill={`url(#${id}-g1)`} />
      <Ellipse cx="78" cy="132" rx="34" ry="12" fill={`url(#${id}-g1)`} />
      <Rect x="46" y="118" width="64" height="14" fill={`url(#${id}-g2)`} />
      <Ellipse cx="78" cy="118" rx="32" ry="11" fill={`url(#${id}-g2)`} />
      <Ellipse cx="78" cy="114" rx="22" ry="7" fill="#FFFFFF" opacity="0.3" />

      <Path
        d="M112 108 C132 96, 140 84, 156 62"
        fill="none"
        stroke={P.emerald}
        strokeWidth="11"
        strokeLinecap="round"
      />
      <Path d="M140 60 L160 56 L156 76 Z" fill={P.emerald} />
    </>
  );
}

/* ============ ONBOARDING ============ */

function Onboarding() {
  const id = 'ill-onboarding';
  return (
    <>
      <Defs>
        <LinearGradient id={`${id}-phone`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#33456B" />
          <Stop offset="1" stopColor="#0B1424" />
        </LinearGradient>
        <LinearGradient id={`${id}-screen`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={P.navyMid} />
          <Stop offset="0.6" stopColor={P.navySoft} />
          <Stop offset="1" stopColor={P.coral} />
        </LinearGradient>
        <LinearGradient id={`${id}-card`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#7C63C8" />
          <Stop offset="1" stopColor={P.purple} />
        </LinearGradient>
      </Defs>
      <Cast id={id} cx={100} cy={178} rx={54} ry={10} />

      <Rect x="46" y="34" width="82" height="140" rx="20" fill={`url(#${id}-phone)`} />
      <Rect x="52" y="40" width="70" height="128" rx="15" fill={`url(#${id}-screen)`} />
      <Rect x="74" y="46" width="26" height="6" rx="3" fill="#0B1424" opacity="0.5" />
      <Rect x="60" y="72" width="54" height="10" rx="5" fill="#FFFFFF" opacity="0.35" />
      <Rect x="60" y="90" width="38" height="8" rx="4" fill="#FFFFFF" opacity="0.22" />
      <Rect x="60" y="112" width="54" height="26" rx="9" fill="#FFFFFF" opacity="0.14" />

      <G>
        <Rect x="104" y="104" width="72" height="46" rx="12" fill={`url(#${id}-card)`} />
        <Rect x="110" y="112" width="60" height="8" rx="4" fill="#FFFFFF" opacity="0.3" />
        <Rect x="110" y="132" width="26" height="8" rx="4" fill="#FFFFFF" opacity="0.4" />
        <Rect x="108" y="108" width="64" height="6" rx="3" fill="#FFFFFF" opacity="0.14" />
      </G>
    </>
  );
}

/* ============ CARD — VIRTUAL ============ */

function CardVirtual() {
  const id = 'ill-cardvirtual';
  return (
    <>
      <Defs>
        <LinearGradient id={`${id}-card`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#9DF3C4" />
          <Stop offset="0.5" stopColor={P.emerald} />
          <Stop offset="1" stopColor="#FFFFFF" />
        </LinearGradient>
      </Defs>
      <Cast id={id} cy={164} rx={58} ry={11} />

      <Rect x="30" y="62" width="140" height="88" rx="18" fill={`url(#${id}-card)`} />
      <Rect x="30" y="62" width="140" height="36" rx="16" fill="#FFFFFF" opacity="0.2" />
      <Rect x="46" y="92" width="24" height="18" rx="5" fill="#FFFFFF" opacity="0.75" />
      <Rect x="82" y="96" width="72" height="9" rx="4" fill="#FFFFFF" opacity="0.62" />
      <Rect x="46" y="124" width="46" height="8" rx="4" fill="#FFFFFF" opacity="0.5" />
      <Circle cx="146" cy="128" r="9" fill="#FFFFFF" opacity="0.5" />
      <Circle cx="130" cy="128" r="9" fill="#FFFFFF" opacity="0.34" />
    </>
  );
}

/* ============ CARD — METAL ============ */

function CardMetal() {
  const id = 'ill-cardmetal';
  return (
    <>
      <Defs>
        <LinearGradient id={`${id}-card`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#F7DFA8" />
          <Stop offset="0.35" stopColor={P.gold} />
          <Stop offset="0.62" stopColor="#8A6320" />
          <Stop offset="1" stopColor={P.navy} />
        </LinearGradient>
        <LinearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="0.4">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.5" />
          <Stop offset="0.4" stopColor="#FFFFFF" stopOpacity="0.05" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.22" />
        </LinearGradient>
      </Defs>
      <Cast id={id} cy={164} rx={58} ry={11} />

      <Rect x="30" y="62" width="140" height="88" rx="18" fill={`url(#${id}-card)`} />
      <Rect x="30" y="62" width="140" height="88" rx="18" fill={`url(#${id}-sheen)`} />
      <Rect x="30" y="62" width="140" height="30" rx="16" fill="#FFFFFF" opacity="0.14" />
      <Rect x="46" y="110" width="24" height="18" rx="5" fill="#FFF3D0" opacity="0.9" />
      <Rect x="82" y="114" width="72" height="9" rx="4" fill="#FFFFFF" opacity="0.66" />
      <Rect x="46" y="134" width="46" height="7" rx="3.5" fill="#FFFFFF" opacity="0.5" />
    </>
  );
}

/* ============ SHIELD ============ */

function Shield() {
  const id = 'ill-shield';
  return (
    <>
      <Defs>
        <LinearGradient id={`${id}-body`} x1="0" y1="0" x2="0.8" y2="1">
          <Stop offset="0" stopColor="#4E6BA0" />
          <Stop offset="0.5" stopColor={P.navyMid} />
          <Stop offset="1" stopColor={P.navy} />
        </LinearGradient>
        <LinearGradient id={`${id}-lock`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#8CF0B8" />
          <Stop offset="1" stopColor="#159C58" />
        </LinearGradient>
      </Defs>
      <Cast id={id} cy={172} rx={50} ry={10} />

      <Path
        d="M100 30 L156 52 C156 110 136 148 100 168 C64 148 44 110 44 52 Z"
        fill={`url(#${id}-body)`}
      />
      <Path
        d="M100 40 L146 58 C146 106 130 138 100 156 C70 138 54 106 54 58 Z"
        fill="#FFFFFF"
        opacity="0.08"
      />
      <Rect x="88" y="94" width="24" height="26" rx="7" fill={`url(#${id}-lock)`} />
      <Path
        d="M90 94 V84 A10 10 0 0 1 110 84 V94"
        fill="none"
        stroke={`url(#${id}-lock)`}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <Circle cx="100" cy="105" r="4" fill="#0B1424" opacity="0.6" />
    </>
  );
}

const registry: Record<IllustrationKey, React.FC> = {
  wallet: Wallet,
  success: Success,
  coins: Coins,
  onboarding: Onboarding,
  cardVirtual: CardVirtual,
  cardMetal: CardMetal,
  shield: Shield,
};

/**
 * Renders an illustration at the requested square size.
 * `name` selects the piece; vectors scale without loss.
 */
export function Illustration({ name, size = 160 }: { name: IllustrationKey; size?: number }) {
  const Piece = registry[name];
  return (
    <Svg viewBox="0 0 200 200" width={size} height={size}>
      <Piece />
    </Svg>
  );
}
