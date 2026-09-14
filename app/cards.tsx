import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { WalletCardView } from '../src/components/cards/WalletCardView';
import { ScreenHeader } from '../src/components/ui/ScreenHeader';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { Button } from '../src/components/ui/Button';
import { SlideUpModal } from '../src/components/ui/SlideUpModal';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { cardShop } from '../src/data/mock';
import { formatPula, maskCard } from '../src/utils/format';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

/**
 * Cards & Wallets.
 *
 * The layered card list — each card a real gradient face with its scheme
 * mark, live balance and masked PAN — plus the Card Shop catalogue
 * (Virtual · Physical · Metal). Tapping a card opens its details sheet;
 * there is no 3D flip, no spin.
 */
export default function CardsScreen() {
  const { theme } = useTheme();
  const { state, dispatch } = useApp();
  const { show } = useToast();
  const [addCardId, setAddCardId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [detailCard, setDetailCard] = useState<any>(null);

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
    <ScreenContainer>
      <StaggeredItem index={0}>
        <Text style={[styles.title, { color: theme.text }]}>Cards &amp; wallets</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Everything you can tap.
        </Text>
      </StaggeredItem>

      {/* Layered gradient card list */}
      {state.cards.map((card, i) => (
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
                style={[styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.hairline }]}
                onPress={() => openAdd(card.id)}
              >
                <Ionicons name="add" size={15} color={theme.primary} />
                <Text style={[styles.actionText, { color: theme.primary }]}>Add money</Text>
              </PressableScale>
              <PressableScale
                style={[styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.hairline }]}
                onPress={() => toggleFreeze(card.id)}
              >
                <Ionicons
                  name={card.frozen ? 'play' : 'pause'}
                  size={15}
                  color={theme.textSecondary}
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
      <StaggeredItem index={state.cards.length + 1}>
        <ScreenHeader title="Card shop" subtitle="Order a new card in a tap." />
      </StaggeredItem>

      <StaggeredItem index={state.cards.length + 2}>
        <GlassCard solid style={styles.shopCard}>
          {cardShop.map((p, i) => (
            <PressableScale
              key={p.id}
              style={[styles.shopRow, i > 0 && { borderTopWidth: 1, borderTopColor: theme.hairline }]}
              onPress={() => {
                haptics.light();
                show(`${p.name} · ${p.priceLabel}`, 'info');
              }}
            >
              <View style={[styles.shopIcon, { backgroundColor: p.color + '16' }]}>
                <Ionicons name={p.icon as any} size={18} color={p.color} />
              </View>
              <View style={styles.shopInfo}>
                <Text style={[styles.shopName, { color: theme.text }]}>{p.name}</Text>
                <Text style={[styles.shopBlurb, { color: theme.textMuted }]}>{p.blurb}</Text>
              </View>
              <Text style={[styles.shopPrice, { color: theme.text }]}>{p.priceLabel}</Text>
            </PressableScale>
          ))}
        </GlassCard>
      </StaggeredItem>

      {/* Add money sheet */}
      <SlideUpModal visible={!!addCardId} onClose={() => setAddCardId(null)}>
        <Text style={[styles.modalTitle, { color: theme.text }]}>Add money</Text>
        <Text style={[styles.modalSub, { color: theme.textMuted }]}>
          Top up your {state.cards.find((c) => c.id === addCardId)?.name}
        </Text>
        <View style={[styles.inputWrap, { borderColor: theme.hairline }]}>
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

            <View style={[styles.limitRow, { borderColor: theme.hairline }]}>
              <View>
                <Text style={[styles.limitLabel, { color: theme.textMuted }]}>Daily limit</Text>
                <Text style={[styles.limitValue, { color: theme.text }]}>
                  {formatPula(detailCard.limit ?? 0)}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: detailCard.frozen ? theme.danger : theme.primary },
                ]}
              >
                <Text style={styles.statusBadgeText}>
                  {detailCard.frozen ? 'Frozen' : 'Active'}
                </Text>
              </View>
            </View>

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
  icon: any;
  label: string;
  value: string;
  theme: any;
}) {
  return (
    <View style={[styles.detailTile, { backgroundColor: theme.surfaceAlt }]}>
      <Ionicons name={icon} size={17} color={theme.accent} />
      <Text style={[styles.detailTileLabel, { color: theme.textMuted }]}>{label}</Text>
      <Text style={[styles.detailTileValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...type.largeTitle,
  },
  subtitle: {
    ...type.caption,
    marginTop: 2,
    marginBottom: spacing.xl,
  },

  cardWrap: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  actionText: {
    ...type.caption,
    fontWeight: '600',
  },

  shopCard: {
    padding: 0,
  },
  shopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: spacing.md,
  },
  shopIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    ...type.body,
    fontWeight: '600',
  },
  shopBlurb: {
    ...type.caption,
    fontSize: 12,
    marginTop: 1,
  },
  shopPrice: {
    ...type.money,
  },

  modalTitle: {
    ...type.title,
    marginBottom: 2,
  },
  modalSub: {
    ...type.caption,
    marginBottom: spacing.xl,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  inputPrefix: {
    ...type.title,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...type.title,
    fontVariant: ['tabular-nums'],
    paddingVertical: spacing.lg,
  },

  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  detailTile: {
    width: '48%',
    flexGrow: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 3,
  },
  detailTileLabel: {
    ...type.caption,
    fontSize: 12,
  },
  detailTileValue: {
    ...type.money,
    fontWeight: '700',
  },
  limitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  limitLabel: {
    ...type.caption,
  },
  limitValue: {
    ...type.heading,
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  statusBadgeText: {
    color: '#fff',
    ...type.small,
    fontWeight: '600',
  },
});