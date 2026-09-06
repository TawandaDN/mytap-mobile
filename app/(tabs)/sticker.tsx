import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { GlassCard } from '../../src/components/cards/GlassCard';
import { StaggeredItem } from '../../src/components/animations/Staggered';
import { TiltCard } from '../../src/components/cards/TiltCard';
import { SlideUpModal } from '../../src/components/ui/SlideUpModal';
import { useToast } from '../../src/components/ui/Toast';
import { useApp } from '../../src/store/AppStore';
import { shortDate } from '../../src/utils/format';
import { spacing, type, radius } from '../../src/theme';
import { haptics } from '../../src/utils/haptics';
import { PressableScale } from '../../src/components/ui/PressableScale';

const STICKER_DESIGNS = [
  { id: 'd1', name: 'Classic Navy', emoji: '🌊', color: '#1E3A5F' },
  { id: 'd2', name: 'Sunset Coral', emoji: '🌅', color: '#FF6B4A' },
  { id: 'd3', name: 'Royal Indigo', emoji: '💜', color: '#6B3A8A' },
  { id: 'd4', name: 'Emerald', emoji: '💚', color: '#2ECC71' },
  { id: 'd5', name: 'Gold', emoji: '✨', color: '#F5A623' },
  { id: 'd6', name: 'Rose Gold', emoji: '🌹', color: '#B76E79' },
];

export default function StickerScreen() {
  const { theme } = useTheme();
  const { state, dispatch } = useApp();
  const { show } = useToast();
  const [designModal, setDesignModal] = useState(false);
  const [appliedDesign, setAppliedDesign] = useState('d1');

  const toggle = (id: string, name: string, status: string) => {
    dispatch({ type: 'TOGGLE_STICKER', stickerId: id });
    haptics.medium();
    show(
      status === 'active' ? `${name} frozen` : `${name} activated`,
      status === 'active' ? 'info' : 'success'
    );
  };

  const applyDesign = (d: any) => {
    setAppliedDesign(d.id);
    setDesignModal(false);
    haptics.success();
    show(`Applied "${d.name}" to your sticker`);
  };

  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <Text style={[styles.title, { color: theme.text }]}>NFC Stickers</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>Tap to pay with your stickers</Text>
      </StaggeredItem>

      {state.stickers.map((s, i) => (
        <StaggeredItem key={s.id} index={i + 1}>
          <TiltCard style={styles.stickerCard}>
            <GlassCard
              bubbleColor={s.status === 'active' ? 'rgba(46,204,113,0.2)' : 'rgba(231,76,60,0.15)'}
              style={styles.stickerInner}
            >
              <View style={styles.stickerTop}>
                <View style={[styles.stickerIcon, { backgroundColor: s.status === 'active' ? '#2ECC71' : '#E74C3C' }]}>
                  <Ionicons name="radio" size={22} color="#fff" />
                </View>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: s.status === 'active' ? '#2ECC71' : '#E74C3C' },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {s.status === 'active' ? 'Active' : 'Frozen'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.stickerName, { color: theme.text }]}>{s.name}</Text>
              <Text style={[styles.stickerSerial, { color: theme.textMuted }]}>{s.serial}</Text>
              <View style={styles.stickerStats}>
                <View style={styles.stat}>
                  <Text style={[styles.statValue, { color: theme.text }]}>{s.uses}</Text>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>Taps</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={[styles.statValue, { color: theme.text }]}>{shortDate(s.lastUsed)}</Text>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>Last used</Text>
                </View>
              </View>
              <PressableScale
                style={[
                  styles.toggleBtn,
                  { backgroundColor: s.status === 'active' ? '#E74C3C' : '#2ECC71' },
                ]}
                onPress={() => toggle(s.id, s.name, s.status)}
              >
                <Ionicons
                  name={s.status === 'active' ? 'pause' : 'play'}
                  size={16}
                  color="#fff"
                />
                <Text style={styles.toggleText}>
                  {s.status === 'active' ? 'Freeze sticker' : 'Activate sticker'}
                </Text>
              </PressableScale>
            </GlassCard>
          </TiltCard>
        </StaggeredItem>
      ))}

      {/* Sticker design customization */}
      <StaggeredItem index={state.stickers.length + 1}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Sticker design</Text>
        <GlassCard bubbleColor="rgba(107,58,138,0.15)">
          <View style={styles.designRow}>
            <View style={[styles.designPreview, { backgroundColor: STICKER_DESIGNS.find((d) => d.id === appliedDesign)?.color }]}>
              <Ionicons name="radio" size={24} color="#fff" />
            </View>
            <View style={styles.designInfo}>
              <Text style={[styles.designTitle, { color: theme.text }]}>
                {STICKER_DESIGNS.find((d) => d.id === appliedDesign)?.name}
              </Text>
              <Text style={[styles.designSub, { color: theme.textMuted }]}>
                Customize the look of your NFC sticker
              </Text>
            </View>
            <PressableScale
              style={[styles.designBtn, { backgroundColor: theme.accent }]}
              onPress={() => { setDesignModal(true); haptics.medium(); }}
            >
              <Text style={styles.designBtnText}>Change</Text>
            </PressableScale>
          </View>
        </GlassCard>
      </StaggeredItem>

      {/* Activity */}
      <StaggeredItem index={state.stickers.length + 2}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent activity</Text>
        <GlassCard bubble={false}>
          {[
            { action: 'Tap at Choppies', time: 'Today, 09:12', amount: '-P278.59' },
            { action: 'Tap at BPC', time: 'Yesterday, 18:40', amount: '-P100.00' },
            { action: 'Tap at Mascom', time: '29 Aug, 11:30', amount: '-P5.00' },
          ].map((a, i) => (
            <View key={i} style={[styles.activityRow, i > 0 && styles.activityDivider]}>
              <View style={[styles.activityIcon, { backgroundColor: theme.accent + '22' }]}>
                <Ionicons name="radio" size={16} color={theme.accent} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={[styles.activityLabel, { color: theme.text }]}>{a.action}</Text>
                <Text style={[styles.activityTime, { color: theme.textMuted }]}>{a.time}</Text>
              </View>
              <Text style={[styles.activityAmount, { color: '#E74C3C' }]}>{a.amount}</Text>
            </View>
          ))}
        </GlassCard>
      </StaggeredItem>

      {/* Design picker modal */}
      <SlideUpModal visible={designModal} onClose={() => setDesignModal(false)}>
        <Text style={[styles.modalTitle, { color: theme.text }]}>Choose a design</Text>
        <Text style={[styles.modalSub, { color: theme.textMuted }]}>Pick a look for your NFC sticker</Text>
        <View style={styles.designGrid}>
          {STICKER_DESIGNS.map((d) => (
            <PressableScale
              key={d.id}
              style={[styles.designCard, { borderColor: appliedDesign === d.id ? theme.accent : theme.border }]}
              onPress={() => applyDesign(d)}
            >
              <View style={[styles.designSwatch, { backgroundColor: d.color }]}>
                <Text style={styles.designEmoji}>{d.emoji}</Text>
                {appliedDesign === d.id && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  </View>
                )}
              </View>
              <Text style={[styles.designName, { color: theme.text }]}>{d.name}</Text>
            </PressableScale>
          ))}
        </View>
      </SlideUpModal>
    </ScreenContainer>
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
  stickerCard: {
    marginBottom: spacing.lg,
  },
  stickerInner: {
    padding: spacing.lg,
  },
  stickerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  stickerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  stickerName: {
    fontSize: 20,
    fontWeight: '700',
  },
  stickerSerial: {
    fontSize: 14,
    letterSpacing: 1,
    marginTop: 2,
  },
  stickerStats: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  stat: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(15,23,41,0.08)',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: radius.pill,
  },
  toggleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  activityDivider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(15,23,41,0.06)',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  activityInfo: {
    flex: 1,
  },
  activityLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  activityTime: {
    fontSize: 12,
    marginTop: 2,
  },
  activityAmount: {
    fontSize: 15,
    fontWeight: '600',
  },
  designRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  designPreview: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  designInfo: {
    flex: 1,
  },
  designTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  designSub: {
    fontSize: 13,
    marginTop: 2,
  },
  designBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  designBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 14,
    marginBottom: spacing.lg,
  },
  designGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  designCard: {
    width: '30%',
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.sm,
    alignItems: 'center',
    gap: 6,
  },
  designSwatch: {
    width: '100%',
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  designEmoji: {
    fontSize: 22,
  },
  checkBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2ECC71',
    alignItems: 'center',
    justifyContent: 'center',
  },
  designName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});