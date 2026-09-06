import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import { Receipt } from '../../data/mock';
import { formatPula } from '../../utils/format';
import { radius, spacing, type } from '../../theme';
import { haptics } from '../../utils/haptics';
import { PressableScale } from '../ui/PressableScale';
import { useToast } from '../ui/Toast';

export function ReceiptView({ receipt }: { receipt: Receipt }) {
  const { theme } = useTheme();
  const { show } = useToast();

  const html = `
  <html><body style="font-family: -apple-system, Helvetica, sans-serif; background:#F5F7FA; margin:0; padding:24px;">
    <div style="background:#0F1729; border-radius:20px; padding:24px; color:#fff;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:22px; font-weight:700;">MyTap</span>
        <span style="font-size:12px; opacity:.7;">Digital Receipt</span>
      </div>
      <div style="text-align:center; margin:24px 0;">
        <div style="font-size:40px; font-weight:700;">${formatPula(receipt.amount)}</div>
        <div style="opacity:.7; margin-top:4px;">paid to ${receipt.merchant}</div>
      </div>
    </div>
    <div style="background:#fff; border-radius:20px; padding:24px; margin-top:16px;">
      <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #eee;"><span style="color:#6B7A8A;">Merchant</span><span style="font-weight:600;">${receipt.merchant}</span></div>
      <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #eee;"><span style="color:#6B7A8A;">Category</span><span style="font-weight:600;">${receipt.category}</span></div>
      <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #eee;"><span style="color:#6B7A8A;">Reference</span><span style="font-weight:600;">${receipt.ref}</span></div>
      <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #eee;"><span style="color:#6B7A8A;">Date</span><span style="font-weight:600;">${new Date(receipt.date).toLocaleString()}</span></div>
      <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #eee;"><span style="color:#6B7A8A;">Method</span><span style="font-weight:600;">${receipt.method}</span></div>
      <div style="display:flex; justify-content:space-between; padding:8px 0;"><span style="color:#6B7A8A;">Status</span><span style="font-weight:700; color:#2ECC71;">Completed</span></div>
    </div>
    <p style="text-align:center; color:#6B7A8A; font-size:12px; margin-top:24px;">Thank you for using MyTap · Gaborone, Botswana</p>
  </body></html>`;

  const download = async () => {
    haptics.medium();
    try {
      const { uri } = await Print.printToFileAsync({ html });
      if (Platform.OS === 'web') { show('Receipt generated', 'success'); return; }
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Share MyTap receipt', UTI: 'com.adobe.pdf' });
        haptics.success();
      } else {
        show('Sharing not available', 'info');
      }
    } catch (e) {
      show('Could not generate receipt', 'error');
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <LinearGradient colors={['#0F1729', '#1E3A5F']} style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.brand}>MyTap</Text>
          <Text style={styles.receiptLabel}>Digital Receipt</Text>
        </View>
        <View style={styles.amountWrap}>
          <Text style={styles.amount}>{formatPula(receipt.amount)}</Text>
          <Text style={styles.paidTo}>paid to {receipt.merchant}</Text>
        </View>
      </LinearGradient>
      <View style={styles.body}>
        <Row label="Merchant" value={receipt.merchant} theme={theme} />
        <Row label="Category" value={receipt.category} theme={theme} />
        <Row label="Reference" value={receipt.ref} theme={theme} />
        <Row label="Date" value={new Date(receipt.date).toLocaleString()} theme={theme} />
        <Row label="Method" value={receipt.method} theme={theme} />
        <Row label="Status" value="Completed" theme={theme} accent="#2ECC71" last />
      </View>
      <View style={styles.actions}>
        <PressableScale style={[styles.actionBtn, { backgroundColor: theme.accent }]} onPress={download}>
          <Ionicons name="download-outline" size={18} color="#fff" />
          <Text style={styles.actionText}>Download / Share</Text>
        </PressableScale>
      </View>
    </View>
  );
}

function Row({ label, value, theme, accent, last }: { label: string; value: string; theme: any; accent?: string; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={[styles.rowLabel, { color: theme.textMuted }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: accent || theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.xl, overflow: 'hidden', borderWidth: 1 },
  header: { padding: spacing.xl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: '#fff', fontSize: 20, fontWeight: '700' },
  receiptLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  amountWrap: { alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.sm },
  amount: { color: '#fff', fontSize: 40, fontWeight: '700' },
  paidTo: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4 },
  body: { padding: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(15,23,41,0.06)' },
  rowLabel: { fontSize: 14 },
  rowValue: { fontSize: 14, fontWeight: '600' },
  actions: { padding: spacing.lg, paddingTop: 0 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: radius.pill },
  actionText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});