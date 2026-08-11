import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Category } from '@/types/task';
import { ThemedText } from './themed-text';

interface CategoryBadgeProps {
  category?: Category;
  size?: 'small' | 'medium';
}

const CATEGORY_STYLES: Record<Category, { bg: string; text: string; icon: string }> = {
  Work: { bg: '#EEF2FF', text: '#4F46E5', icon: '💼' },
  Personal: { bg: '#F3E8FF', text: '#9333EA', icon: '👤' },
  Shopping: { bg: '#ECFDF5', text: '#059669', icon: '🛒' },
  Health: { bg: '#FFE4E6', text: '#E11D48', icon: '🏃' },
  Finance: { bg: '#FEF3C7', text: '#D97706', icon: '💰' },
  Other: { bg: '#F1F5F9', text: '#475569', icon: '📌' },
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category = 'Other', size = 'small' }) => {
  const styleConfig = CATEGORY_STYLES[category] || CATEGORY_STYLES.Other;
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: styleConfig.bg },
        isSmall ? styles.smallBadge : styles.mediumBadge,
      ]}>
      <ThemedText style={isSmall ? styles.smallIcon : styles.mediumIcon}>
        {styleConfig.icon}
      </ThemedText>
      <ThemedText
        style={[
          styles.text,
          { color: styleConfig.text },
          isSmall ? styles.smallText : styles.mediumText,
        ]}>
        {category}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  smallBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    gap: 4,
  },
  mediumBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  smallIcon: {
    fontSize: 11,
  },
  mediumIcon: {
    fontSize: 13,
  },
  text: {
    fontWeight: '700',
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
