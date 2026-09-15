import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GradientHeader } from '../src/components/ui/GradientHeader';
import { Card, ElevatedCard } from '../src/components/ui/CardSystem';
import { Divider, TileIcon, catColor } from '../src/components/ui/IconSystem';
import { EmptyState } from '../src/components/ui/EmptyState';
import { CardsSkeleton } from '../src/components/animations/Skeletons';
import { Illustration } from '../src/assets/illustrations';
import { WalletCardView } from '../src/components/cards/WalletCardView';
import { ScreenHeader } from '../src/components/ui/ScreenHeader';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { Button } from '../src/components/ui/Button';
import { SlideUpModal } from '../src/components/ui/SlideUpModal';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { cardShop, WalletCard } from '../src/data/mock';
import { formatPula, maskCard } from '../src/utils/format';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';
import { inter, layout, radii, space, text } from '../src/theme/tokens';

/**
 * Cards & Wallets.
 *
 * The layered card list — each card a real gradient face with its scheme
 * mark, live balance and masked PAN — plus the Card Shop catalogue
 * (Virtual · Physical · Metal). Tapping a card opens its details sheet;
 * there is no 3D flip, no spin. Initial mount shows card-shaped shimmer
 * blocks in the real layout.
 */
export default function CardsScreen() {
  const { theme } = useTheme();
  const { state, dispatch } = useApp();
  const { show } = useToast();
  const [addCardId, setAddCardId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [detailCard, setDetailCard] = useState<WalletCard | null>(null);
  const [loading, setLoading] = useState(true);

  /** Initial mount — shimmer on the real layout, then reveal. */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const openAdd = (id: string) => {
    setAmount('');
    setAddCardId(id);
    haptics.medium();
  };

  const confirmAdd = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      show('Enter a valid amount', 'error');
      return;
    }
    dispatch({ type: 'ADD_MONEY', cardId: addCardId!, amount: amt });
    setAddCardId(null);
    haptics.success();
    show(`Added ${formatPula(amt)} to your wallet`);
  };

  const toggleFreeze = (id: string) => {
    dispatch({ type: 'TOGGLE_FREEZE', cardId: id });
    haptics.medium();
  };

  return (
    <ScreenContainer edges={['bottom']} contentContainerStyle={styles.screenContent}>
      <View style={styles.headBleed}>
        <GradientHeader kind="cards">
          <Text style={styles.headKicker}>CARDS &amp; WALLETS</Text>
          <Text style={styles.headTitle}>Everything you can tap.</Text>
        </GradientHeader>
      </View>

      <View style={styles.body}>
        {/* Loading — card-shaped shimmer blocks in the real layout */}
        {loading && <CardsSkeleton count={3} />}

        {/* Empty — no instruments on the account at all */}
        {!loading && state.cards.length === 0 && (
          <EmptyState
            illustration="cardVirtual"
            title="No cards yet"
            subtitle="Add a MyTap Wallet or order a card from the shop below — it appears here the moment it is issued."
            actionLabel="Open the card shop"
            onAction={() => {
              haptics.light();
              show('Scroll down to the card shop', 'info');
            }}
            style={styles.emptyCard}
          />
        )}

        {/* Layered gradient card list */}
        {!loading &&
          state.cards.map((card, i) => (
            <StaggeredItem key={card.id} index={i + 1}>
              <View style={styles.cardWrap}>
                <WalletCardView
                  card={card}
                  height={188}
                  hideBalance={state.hideBalances}
                  onPress={() => {
                    setDetailCard(card);
                    haptics.medium();
                  }}
                />
                <View style={styles.cardActions}>
                  <PressableScale
                    radius={radii.pill}
                    haptic="light"
                    style={[styles.actionBtn, { backgroundColor: theme.surface }]}
                    onPress={() => openAdd(card.id)}
                  >
                    <TileIcon icon="add" color={theme.primary} size={26} radius={9} glyph={15} />
                    <Text style={[styles.actionText, { color: theme.primary }]}>Add money</Text>
                  </PressableScale>
                  <PressableScale
                    radius={radii.pill}
                    haptic="medium"
                    style={[styles.actionBtn, { backgroundColor: theme.surface }]}
                    onPress={() => toggleFreeze(card.id)}
                  >
                    <TileIcon
                      icon={card.frozen ? 'play' : 'pause'}
                      color={catColor('history')}
                      size={26}
                      radius={9}
                      glyph={15}
                    />
                    <Text style={[styles.actionText, { color: theme.textSecondary }]}>
                      {card.frozen ? 'Unfreeze' : 'Freeze'}
                    </Text>
                  </PressableScale>
                </View>
              </View>
            </StaggeredItem>
          ))}

        {/* Card Shop */}
        {!loading && (
          <>
            <StaggeredItem index={state.cards.length + 1}>
              <ScreenHeader title="Card shop" subtitle="Order a new card in a tap." />
            </StaggeredItem>

            <StaggeredItem index={state.cards.length + 2}>
              <Card padded={false} style={styles.shopCard}>
                {cardShop.map((p, i) => (
                  <View key={p.id}>
                    {i > 0 && (
                      <Divider indent={space.md + 44 + layout.iconToText} />
                    )}
                    <PressableScale
                      radius={0}
                      haptic="light"
                      style={styles.shopRow}
                      onPress={() => {
                        haptics.light();
                        show(`${p.name} · ${p.priceLabel}`, 'info');
                      }}
                    >
                      <View style={[styles.shopIcon, { backgroundColor: theme.background }]}>
                        <Illustration
                          name={p.id === 'cs-metal' ? 'cardMetal' : 'cardVirtual'}
                          size={44}
                        />
                      </View>
                      <View style={styles.shopInfo}>
                        <Text style={[styles.shopName, { color: theme.text }]}>{p.name}</Text>
                        <Text style={[styles.shopBlurb, { color: theme.textMuted }]}>{p.blurb}</Text>
                      </View>
                      <Text style={[styles.shopPrice, { color: theme.text }]}>{p.priceLabel}</Text>
                    </PressableScale>
                  </View>
                ))}
              </Card>
            </StaggeredItem>
          </>
        )}
      </View>

      {/* Add money sheet */}
      <SlideUpModal visible={!!addCardId} onClose={() => setAddCardId(null)}>
        <Text style={[styles.modalTitle, { color: theme.text }]}>Add money</Text>
        <Text style={[styles.modalSub, { color: theme.textMuted }]}>
          Top up your {state.cards.find((c) => c.id === addCardId)?.name}
        </Text>
        <View
          style={[
            styles.inputWrap,
            { borderColor: theme.hairline, backgroundColor: theme.background },
          ]}
        >
          <Text style={[styles.inputPrefix, { color: theme.textMuted }]}>P</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { color: theme.text }]}
          />
        </View>
        <Button title="Add money" onPress={confirmAdd} fullWidth />
      </SlideUpModal>

      {/* Card details sheet */}
      <SlideUpModal visible={!!detailCard} onClose={() => setDetailCard(null)}>
        {detailCard && (
          <>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{detailCard.name}</Text>
            <Text style={[styles.modalSub, { color: theme.textMuted }]}>
              {detailCard.brand} · {detailCard.virtual ? 'Virtual' : 'Physical'}
            </Text>

            <View style={styles.detailGrid}>
              <DetailTile icon="card" label="Number" value={maskCard(detailCard.last4)} theme={theme} />
              <DetailTile icon="calendar" label="Expiry" value={detailCard.expiry} theme={theme} />
              <DetailTile icon="key" label="PIN" value={detailCard.pin} theme={theme} />
              <DetailTile icon="shield" label="CVV" value={detailCard.cvv} theme={theme} />
            </View>

            <ElevatedCard style={styles.limitCard}>
              <View style={styles.limitRow}>
                <TileIcon
                  icon="speedometer"
                  color={detailCard.frozen ? theme.danger : catColor('transport')}
                />
                <View style={styles.limitInfo}>
                  <Text style={[styles.limitLabel, { color: theme.textMuted }]}>Daily limit</Text>
                  <Text style={[styles.limitValue, { color: theme.text }]}>
                    {formatPula(detailCard.limit ?? 0)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: `${
                        detailCard.frozen ? theme.danger : catColor('transport')
                      }1F`,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      {
                        color: detailCard.frozen ? theme.danger : catColor('transport'),
                      },
                    ]}
                  >
                    {detailCard.frozen ? 'Frozen' : 'Active'}
                  </Text>
                </View>
              </View>
            </ElevatedCard>

            <Button
              title={detailCard.frozen ? 'Unfreeze card' : 'Freeze card'}
              variant={detailCard.frozen ? 'primary' : 'danger'}
              fullWidth
              onPress={() => {
                toggleFreeze(detailCard.id);
                setDetailCard(null);
              }}
            />
          </>
        )}
      </SlideUpModal>
    </ScreenContainer>
  );
}

function DetailTile({
  icon,
  label,
  value,
  theme,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  theme: { accent: string; text: string; textMuted: string; background: string };
}) {
  return (
    <View style={[styles.detailTile, { backgroundColor: theme.background }]}>
      <View style={styles.detailTileHead}>
        <TileIcon icon={icon} color={theme.accent} size={28} radius={9} glyph={14} />
        <Text style={[styles.detailTileLabel, { color: theme.textMuted }]}>{label}</Text>
      </View>
      <Text style={[styles.detailTileValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  headBleed: {
    marginBottom: space.lg,
  },
  headKicker: {
    color: 'rgba(255,255,255,0.72)',
    ...text.sectionLabel,
  },
  headTitle: {
    color: '#FFFFFF',
    ...text.screenTitle,
    marginTop: space.xxs,
  },
  body: {
    paddingHorizontal: space.md,
  },
  emptyCard: {
    marginBottom: layout.cardGap,
  },

  cardWrap: {
    marginBottom: layout.cardGap,
    gap: space.xs,
  },
  cardActions: {
    flexDirection: 'row',
    gap: space.xs,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flex: 1,
    paddingVertical: space.xs + 2,
  },
  actionText: {
    ...text.caption,
    fontFamily: inter.semibold,
    fontWeight: '600',
  },

  shopCard: {
    marginTop: space.xxs,
  },
  shopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  shopIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.icon,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  shopInfo: {
    flex: 1,
    marginHorizontal: layout.iconToText,
  },
  shopName: {
    ...text.cardTitle,
  },
  shopBlurb: {
    ...text.caption,
    fontSize: 12.5,
    marginTop: layout.bodyToCaption,
  },
  shopPrice: {
    ...text.moneyTabular,
  },

  modalTitle: {
    ...text.screenTitle,
    fontSize: 22,
    marginBottom: space.xxs,
  },
  modalSub: {
    ...text.caption,
    marginBottom: space.lg,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.card,
    paddingHorizontal: space.md,
    marginBottom: layout.contentToButton,
  },
  inputPrefix: {
    fontSize: 20,
    fontFamily: inter.semibold,
    fontWeight: '600',
    marginRight: space.xs,
  },
  input: {
    flex: 1,
    fontSize: 20,
    lineHeight: 26,
    fontFamily: inter.semibold,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    paddingVertical: space.sm + 2,
  },

  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
    marginBottom: layout.cardGap,
  },
  detailTile: {
    width: '48%',
    flexGrow: 1,
    borderRadius: radii.card,
    padding: space.sm,
    gap: space.xs,
  },
  detailTileHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  detailTileLabel: {
    ...text.caption,
    fontSize: 12,
  },
  detailTileValue: {
    ...text.moneyTabular,
    fontSize: 15,
  },

  limitCard: {
    marginBottom: layout.cardGap,
  },
  limitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  limitInfo: {
    flex: 1,
    marginLeft: layout.iconToText,
  },
  limitLabel: {
    ...text.label,
  },
  limitValue: {
    ...text.cardTitle,
    fontVariant: ['tabular-nums'],
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: space.sm,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  statusBadgeText: {
    ...text.label,
    fontFamily: inter.semibold,
    fontWeight: '700',
  },
});
