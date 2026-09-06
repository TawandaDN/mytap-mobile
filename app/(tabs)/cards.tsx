import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../src/theme/ThemeContext';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { GlassCard } from '../../src/components/cards/GlassCard';
import { StaggeredItem } from '../../src/components/animations/Staggered';
import { Button } from '../../src/components/ui/Button';
import { SlideUpModal } from '../../src/components/ui/SlideUpModal';
import { useToast } from '../../src/components/ui/Toast';
import { useApp } from '../../src/store/AppStore';
import { formatPula, maskCard } from '../../src/utils/format';
import { spacing, type, radius } from '../../src/theme';
import { haptics } from '../../src/utils/haptics';
import { PressableScale } from '../../src/components/ui/PressableScale';

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
        <Text style={[styles.title, { color: theme.text }]}>Your cards</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>Everything you can tap</Text>
      </StaggeredItem>

      {state.cards.map((card, i) => (
        <StaggeredItem key={card.id} index={i + 1}>
          <FlipCard
            card={card}
            onAdd={() => openAdd(card.id)}
            onFreeze={() => toggleFreeze(card.id)}
            onDetails={() => { setDetailCard(card); haptics.medium(); }}
          />
        </StaggeredItem>
      ))}

      {/* Card shop */}
      <StaggeredItem index={state.cards.length + 1}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Card shop</Text>
        <GlassCard bubble={false}>
          {['MyTap Wallet', 'Mastercard', 'MyZaka Card'].map((name, i) => (
            <PressableScale
              key={name}
              style={[styles.shopRow, i > 0 && styles.shopDivider]}
              onPress={() => {
                haptics.light();
                show(`${name} is already in your wallet`);
              }}
            >
              <View style={styles.shopIcon}>
                <Ionicons name="card" size={18} color={theme.accent} />
              </View>
              <Text style={[styles.shopName, { color: theme.text }]}>{name}</Text>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </PressableScale>
          ))}
        </GlassCard>
      </StaggeredItem>

      <SlideUpModal visible={!!addCardId} onClose={() => setAddCardId(null)}>
        <Text style={[styles.modalTitle, { color: theme.text }]}>Add money</Text>
        <Text style={[styles.modalSub, { color: theme.textMuted }]}>
          Top up your {state.cards.find((c) => c.id === addCardId)?.name}
        </Text>
        <View style={[styles.inputWrap, { borderColor: theme.border }]}>
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
        <Button title="Add money" onPress={confirmAdd} style={styles.modalBtn} />
      </SlideUpModal>

      {/* Card details modal */}
      <SlideUpModal visible={!!detailCard} onClose={() => setDetailCard(null)}>
        {detailCard && (
          <>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{detailCard.name}</Text>
            <Text style={[styles.modalSub, { color: theme.textMuted }]}>Card details & settings</Text>
            <View style={styles.detailGrid}>
              <DetailTile icon="card" label="Number" value={maskCard(detailCard.last4)} theme={theme} />
              <DetailTile icon="calendar" label="Expiry" value={detailCard.expiry} theme={theme} />
              <DetailTile icon="key" label="PIN" value={detailCard.pin} theme={theme} />
              <DetailTile icon="shield" label="CVV" value={detailCard.cvv} theme={theme} />
            </View>
            <View style={[styles.limitRow, { borderColor: theme.border }]}>
              <View style={styles.limitInfo}>
                <Text style={[styles.limitLabel, { color: theme.textMuted }]}>Daily limit</Text>
                <Text style={[styles.limitValue, { color: theme.text }]}>{formatPula(detailCard.limit)}</Text>
              </View>
              <View style={[styles.virtualBadge, { backgroundColor: detailCard.virtual ? '#2ECC71' : theme.surfaceAlt }]}>
                <Text style={[styles.virtualText, { color: detailCard.virtual ? '#fff' : theme.textMuted }]}>
                  {detailCard.virtual ? 'Virtual' : 'Physical'}
                </Text>
              </View>
            </View>
            <Button
              title={detailCard.frozen ? 'Unfreeze card' : 'Freeze card'}
              variant={detailCard.frozen ? 'primary' : 'danger'}
              onPress={() => { toggleFreeze(detailCard.id); setDetailCard(null); }}
              style={styles.modalBtn}
            />
          </>
        )}
      </SlideUpModal>
    </ScreenContainer>
  );
}

function DetailTile({ icon, label, value, theme }: { icon: any; label: string; value: string; theme: any }) {
  return (
    <View style={[styles.detailTile, { backgroundColor: theme.surfaceAlt }]}>
      <Ionicons name={icon} size={18} color={theme.accent} />
      <Text style={[styles.detailTileLabel, { color: theme.textMuted }]}>{label}</Text>
      <Text style={[styles.detailTileValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

function FlipCard({
  card,
  onFreeze,
  onAdd,
  onDetails,
}: {
  card: any;
  onFreeze: () => void;
  onAdd: () => void;
  onDetails: () => void;
}) {
  const { theme } = useTheme();
  const flip = useSharedValue(0);
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(flip.value, [0, 1], [0, 180])}deg` },
      { rotateX: `${tiltX.value}deg` },
      { rotateY: `${tiltY.value}deg` },
    ],
    opacity: flip.value < 0.5 ? 1 : 0,
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(flip.value, [0, 1], [180, 360])}deg` },
    ],
    opacity: flip.value < 0.5 ? 0 : 1,
  }));

  const toggle = () => {
    flip.value = withSpring(flip.value === 0 ? 1 : 0, { damping: 0.8, stiffness: 100, mass: 0.8 });
    haptics.flip();
  };

  const onTilt = (e: any) => {
    const { locationX, locationY } = e.nativeEvent;
    const w = 300;
    const h = 200;
    tiltX.value = withSpring(((locationY / h) - 0.5) * 10, { damping: 0.8, stiffness: 100, mass: 0.8 });
    tiltY.value = withSpring(((locationX / w) - 0.5) * 10, { damping: 0.8, stiffness: 100, mass: 0.8 });
    haptics.tilt();
  };

  const resetTilt = () => {
    tiltX.value = withSpring(0, { damping: 0.8, stiffness: 100, mass: 0.8 });
    tiltY.value = withSpring(0, { damping: 0.8, stiffness: 100, mass: 0.8 });
  };

  return (
    <Pressable onPress={toggle} onPressIn={onTilt} onPressOut={resetTilt} style={styles.flipWrap}>
      <Animated.View style={[styles.flipFace, frontStyle]}>
        <GlassCard bubbleColor="rgba(255,255,255,0.2)" style={styles.flipCard}>
          <View style={styles.cardTop}>
            <Text style={[styles.cardName, { color: theme.text }]}>{card.name}</Text>
            <View style={[styles.statusPill, { backgroundColor: card.frozen ? '#E74C3C' : '#2ECC71' }]}>
              <Text style={styles.statusText}>{card.frozen ? 'Frozen' : 'Active'}</Text>
            </View>
          </View>
          <Text style={[styles.balance, { color: theme.text }]}>{formatPula(card.balance)}</Text>
          <Text style={[styles.mask, { color: theme.textMuted }]}>{maskCard(card.last4)}</Text>
          <View style={styles.cardActions}>
            <Pressable style={styles.actionBtn} onPress={onAdd}>
              <Ionicons name="add" size={18} color={theme.accent} />
              <Text style={[styles.actionText, { color: theme.accent }]}>Add money</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={onFreeze}>
              <Ionicons name={card.frozen ? 'play' : 'pause'} size={18} color={theme.accent} />
              <Text style={[styles.actionText, { color: theme.accent }]}>
                {card.frozen ? 'Unfreeze' : 'Freeze'}
              </Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={onDetails}>
              <Ionicons name="settings" size={18} color={theme.accent} />
              <Text style={[styles.actionText, { color: theme.accent }]}>Details</Text>
            </Pressable>
          </View>
        </GlassCard>
      </Animated.View>
      <Animated.View style={[styles.flipFace, backStyle]}>
        <GlassCard bubbleColor="rgba(245,166,35,0.2)" style={styles.flipCard}>
          <Text style={[styles.backTitle, { color: theme.text }]}>Card details</Text>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Card number</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{maskCard(card.last4)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Type</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{card.type}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Status</Text>
            <Text style={[styles.detailValue, { color: card.frozen ? '#E74C3C' : '#2ECC71' }]}>
              {card.frozen ? 'Frozen' : 'Active'}
            </Text>
          </View>
          <Pressable style={styles.flipBtn} onPress={toggle}>
            <Ionicons name="refresh" size={16} color={theme.textMuted} />
            <Text style={[styles.flipHintText, { color: theme.textMuted }]}>Tap to flip</Text>
          </Pressable>
        </GlassCard>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  flipWrap: {
    height: 200,
    marginBottom: spacing.lg,
  },
  flipFace: {
    ...StyleSheet.absoluteFill,
  },
  flipCard: {
    flex: 1,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  balance: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: spacing.lg,
  },
  mask: {
    fontSize: 15,
    letterSpacing: 2,
    marginTop: 4,
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(107,58,138,0.1)',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  backTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  flipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.lg,
    alignSelf: 'center',
  },
  flipHintText: {
    fontSize: 13,
  },
  shopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  shopDivider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(15,23,41,0.06)',
  },
  shopIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(107,58,138,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 14,
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
    fontSize: 24,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    paddingVertical: spacing.lg,
  },
  modalBtn: {
    marginTop: spacing.sm,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  detailTile: {
    width: '48%',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 4,
  },
  detailTileLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  detailTileValue: {
    fontSize: 15,
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
  limitInfo: {
    flex: 1,
  },
  limitLabel: {
    fontSize: 13,
  },
  limitValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
  },
  virtualBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  virtualText: {
    fontSize: 12,
    fontWeight: '600',
  },
});