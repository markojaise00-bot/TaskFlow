import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Priority } from '@/types/task';
import { ThemedText } from './themed-text';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'small' | 'medium';
}

const PRIORITY_COLORS: Record<Priority, { bg: string; text: string; border: string }> = {
  Low: {
    bg: '#ECFDF5',
    text: '#047857',
    border: '#A7F3D0',
  },
  Medium: {
    bg: '#FFFBEB',
    text: '#B45309',
    border: '#FDE68A',
  },
  High: {
    bg: '#FEF2F2',
    text: '#B91C1C',
    border: '#FECACA',
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'small' }) => {
  const colors = PRIORITY_COLORS[priority] || PRIORITY_COLORS.Low;
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg, borderColor: colors.border },
        isSmall ? styles.smallBadge : styles.mediumBadge,
      ]}>
      <ThemedText
        style={[
          styles.text,
          { color: colors.text },
          isSmall ? styles.smallText : styles.mediumText,
        ]}>
        {priority} Priority
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  smallBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  mediumBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  text: {
    fontWeight: '600',
  },
  smallText: {
    fontSize: 11,
    lineHeight: 16,
  },
  mediumText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
