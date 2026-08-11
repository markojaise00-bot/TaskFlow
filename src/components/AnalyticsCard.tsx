import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTasks } from '@/context/TaskContext';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

export const AnalyticsCard: React.FC = () => {
  const { streakCount, stats } = useTasks();
  const theme = useTheme();

  const mockWeeklyData = [
    { day: 'M', count: 2, heightPct: 40 },
    { day: 'T', count: 4, heightPct: 80 },
    { day: 'W', count: 3, heightPct: 60 },
    { day: 'T', count: 5, heightPct: 100 },
    { day: 'F', count: 2, heightPct: 40 },
    { day: 'S', count: 1, heightPct: 20 },
    { day: 'S', count: stats.completed, heightPct: Math.min(100, Math.max(20, stats.completed * 25)) },
  ];

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }]}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <ThemedText style={styles.icon}>🔥</ThemedText>
          <View>
            <ThemedText style={styles.streakTitle}>{streakCount} Day Streak!</ThemedText>
            <ThemedText style={styles.streakSub} type="small">
              Keep completing tasks daily
            </ThemedText>
          </View>
        </View>

        <View style={[styles.badge, { backgroundColor: theme.background }]}>
          <ThemedText style={styles.badgeText} type="smallBold">
            PRODUCTIVITY
          </ThemedText>
        </View>
      </View>

      {/* Weekly Activity Bar Chart */}
      <View style={styles.chartContainer}>
        {mockWeeklyData.map((item, index) => (
          <View key={index} style={styles.barColumn}>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { height: `${item.heightPct}%` },
                  index === 6 && { backgroundColor: '#059669' },
                ]}
              />
            </View>
            <ThemedText style={styles.dayLabel} type="small">
              {item.day}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    fontSize: 28,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  streakSub: {
    fontSize: 12,
    opacity: 0.65,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 70,
    paddingTop: 10,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: 14,
    height: 50,
    borderRadius: 7,
    backgroundColor: 'rgba(150, 150, 150, 0.15)',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
    backgroundColor: '#2563EB',
  },
  dayLabel: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.6,
    fontWeight: '600',
  },
});
