import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { Button } from '../src/components/ui/Button';
import { useToast } from '../src/components/ui/Toast';
import { userProfile } from '../src/data/mock';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { show } = useToast();
  const [name, setName] = useState(userProfile.fullName);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const save = () => { haptics.success(); show('Profile updated'); };
  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}><Ionicons name="chevron-back" size={22} color={theme.text} /></PressableScale>
          <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
        </View>
      </StaggeredItem>
      <StaggeredItem index={1}>
        <GlassCard bubbleColor="rgba(107,58,138,0.15)">
          <View style={styles.avatarRow}>
            <View style={[styles.avatar, { backgroundColor: theme.accent }]}><Text style={styles.avatarText}>{userProfile.name[0]}</Text></View>
            <View style={styles.avatarInfo}><Text style={[styles.avatarName, { color: theme.text }]}>{userProfile.fullName}</Text><Text style={[styles.avatarMeta, { color: theme.textMuted }]}>Member since {userProfile.memberSince} · {userProfile.tier} tier</Text></View>
          </View>
          <View style={[styles.kycRow, { borderColor: theme.border }]}>
            <View style={[styles.kycIcon, { backgroundColor: '#2ECC71' }]}><Ionicons name="shield-checkmark" size={18} color="#fff" /></View>
            <View style={styles.kycInfo}><Text style={[styles.kycTitle, { color: theme.text }]}>Identity verified</Text><Text style={[styles.kycSub, { color: theme.textMuted }]}>KYC level 2 · {userProfile.idNumber}</Text></View>
            <Ionicons name="checkmark-circle" size={20} color="#2ECC71" />
          </View>
        </GlassCard>
      </StaggeredItem>
      <StaggeredItem index={2}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Personal details</Text>
        <GlassCard bubble={false}>
          <Field label="Full name" value={name} onChange={setName} theme={theme} />
          <Field label="Email" value={email} onChange={setEmail} theme={theme} />
          <Field label="Phone" value={phone} onChange={setPhone} theme={theme} />
          <Field label="Address" value={userProfile.address} onChange={() => {}} theme={theme} editable={false} />
        </GlassCard>
        <Button title="Save changes" onPress={save} style={styles.saveBtn} />
      </StaggeredItem>
    </ScreenContainer>
  );
}
function Field({ label, value, onChange, theme, editable = true }: { label: string; value: string; onChange: (v: string) => void; theme: any; editable?: boolean }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} editable={editable} placeholderTextColor={theme.textMuted} style={[styles.fieldInput, { color: theme.text }]} />
    </View>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 24, fontWeight: '700' },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  avatarInfo: { flex: 1 },
  avatarName: { fontSize: 20, fontWeight: '700' },
  avatarMeta: { fontSize: 13, marginTop: 2 },
  kycRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderTopWidth: 1, marginTop: spacing.lg, paddingTop: spacing.lg },
  kycIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  kycInfo: { flex: 1 },
  kycTitle: { fontSize: 15, fontWeight: '600' },
  kycSub: { fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: spacing.xl, marginBottom: spacing.md },
  field: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: 'rgba(15,23,41,0.06)' },
  fieldLabel: { fontSize: 12 },
  fieldInput: { fontSize: 16, fontWeight: '500', paddingVertical: 4 },
  saveBtn: { marginTop: spacing.xl },
});