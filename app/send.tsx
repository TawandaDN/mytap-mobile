import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { Button } from '../src/components/ui/Button';
import { SlideUpModal } from '../src/components/ui/SlideUpModal';
import { ShimmerLoader } from '../src/components/ui/ShimmerLoader';
import { SuccessCheck } from '../src/components/ui/SuccessCheck';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { contacts } from '../src/data/mock';
import { formatPula } from '../src/utils/format';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

export default function SendScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { show } = useToast();
  const [contact, setContact] = useState(contacts[0]);
  const [amount, setAmount] = useState('');
  const [stage, setStage] = useState<'idle' | 'processing' | 'success'>('idle');
  const [receipt, setReceipt] = useState<any>(null);

  const send = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      show('Enter a valid amount', 'error');
      return;
    }
    setStage('processing');
    haptics.processing();
    setTimeout(() => {
      dispatch({ type: 'PAY', cardId: 'wallet', amount: amt, merchant: contact.name, category: 'Transfer', icon: '👤', color: contact.avatarColor, method: 'MyTap Wallet' });
      const r = {
        id: `r-${Date.now()}`,
        merchant: contact.name,
        category: 'Transfer',
        amount: amt,
        date: new Date().toISOString(),
        ref: `MT-${Math.floor(100000 + Math.random() * 900000)}`,
        method: 'MyTap Wallet',
        status: 'completed' as const,
        icon: '👤',
        color: contact.avatarColor,
      };
      dispatch({ type: 'ADD_RECEIPT', receipt: r });
      setReceipt(r);
      setStage('success');
      haptics.paymentSuccess();
    }, 800);
  };

  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}>
            <Ionicons name="chevron-back" size={22} color={theme.text} />
          </PressableScale>
          <Text style={[styles.title, { color: theme.text }]}>Send money</Text>
        </View>
      </StaggeredItem>

      <StaggeredItem index={1}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Choose contact</Text>
        <GlassCard bubble={false}>
          {contacts.map((c, i) => (
            <PressableScale
              key={c.id}
              style={[styles.contactRow, i > 0 && styles.divider]}
              onPress={() => { setContact(c); haptics.selection(); }}
            >
              <View style={[styles.avatar, { backgroundColor: c.avatarColor }]}>
                <Text style={styles.avatarText}>{c.name[0]}</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactName, { color: theme.text }]}>{c.name}</Text>
                <Text style={[styles.contactPhone, { color: theme.textMuted }]}>{c.phone}</Text>
              </View>
              {contact.id === c.id && <Ionicons name="checkmark-circle" size={22} color={theme.accent} />}
            </PressableScale>
          ))}
        </GlassCard>
      </StaggeredItem>

      <StaggeredItem index={2}>
        <GlassCard bubble={false}>
          <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Amount</Text>
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
          <Button title={`Send to ${contact.name}`} onPress={send} style={styles.payBtn} />
        </GlassCard>
      </StaggeredItem>

      <SlideUpModal visible={stage === 'processing'} onClose={() => {}}>
        <View style={styles.center}>
          <ShimmerLoader />
          <Text style={[styles.centerText, { color: theme.text }]}>Sending…</Text>
        </View>
      </SlideUpModal>

      <SlideUpModal visible={stage === 'success'} onClose={() => setStage('idle')}>
        <View style={styles.center}>
          <SuccessCheck size={72} />
          <Text style={[styles.successTitle, { color: theme.text }]}>Money sent!</Text>
          <Text style={[styles.successAmount, { color: theme.text }]}>{receipt ? formatPula(receipt.amount) : ''}</Text>
          <Text style={[styles.successTo, { color: theme.textMuted }]}>to {contact.name}</Text>
        </View>
        <Button title="Done" onPress={() => setStage('idle')} style={styles.payBtn} />
      </SlideUpModal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(15,23,41,0.06)',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
  },
  contactPhone: {
    fontSize: 12,
    marginTop: 2,
  },
  fieldLabel: {
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
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
  payBtn: {
    marginTop: spacing.sm,
  },
  center: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  centerText: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: spacing.lg,
  },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  successAmount: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  successTo: {
    fontSize: 15,
    marginTop: 4,
  },
});