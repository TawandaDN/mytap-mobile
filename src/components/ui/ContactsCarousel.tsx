import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { PressableScale } from './PressableScale';
import { contacts } from '../../data/mock';
import { spacing, type } from '../../theme';
import { haptics } from '../../utils/haptics';

/**
 * Quick-transfer contacts — a horizontally scrolling row of circular avatars
 * for frequent contacts, each with an optional notification badge and a
 * trailing "invite" tile. Press-scale + haptic on every tap.
 */
export function ContactsCarousel({ onPress }: { onPress?: (contactId: string) => void }) {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {contacts.map((c) => (
        <PressableScale
          key={c.id}
          style={styles.item}
          scaleTo={0.92}
          onPress={() => {
            haptics.medium();
            onPress?.(c.id);
          }}
        >
          <View style={styles.avatarWrap}>
            <View style={[styles.avatar, { backgroundColor: c.avatarColor }]}>
              <Text style={styles.avatarText}>{c.name[0]}</Text>
            </View>
            {c.recent && (
              <View style={[styles.badge, { borderColor: theme.background }]}>
                <Ionicons name="flash" size={9} color="#fff" />
              </View>
            )}
          </View>
          <Text style={[styles.name, { color: theme.textSecondary }]} numberOfLines={1}>
            {c.name.split(' ')[0]}
          </Text>
        </PressableScale>
      ))}

      <PressableScale style={styles.item} scaleTo={0.92} onPress={() => haptics.light()}>
        <View style={[styles.avatarWrap]}>
          <View
            style={[
              styles.avatar,
              styles.inviteAvatar,
              { borderColor: theme.hairline, backgroundColor: theme.surface },
            ]}
          >
            <Ionicons name="add" size={20} color={theme.textMuted} />
          </View>
        </View>
        <Text style={[styles.name, { color: theme.textMuted }]} numberOfLines={1}>
          New
        </Text>
      </PressableScale>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.lg,
    paddingVertical: spacing.xs,
    paddingRight: spacing.lg,
  },
  item: {
    alignItems: 'center',
    width: 56,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteAvatar: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  avatarText: {
    color: '#fff',
    ...type.heading,
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    right: -2,
    top: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E5604A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  name: {
    ...type.small,
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
});
