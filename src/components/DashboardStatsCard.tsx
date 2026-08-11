import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTasks } from '@/context/TaskContext';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

export const DashboardStatsCard: React.FC = () => {
  const { stats, todayDateFormatted } = useTasks();
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }]}>
      <View style={styles.headerRow}>
        <View>
          <ThemedText style={styles.dateLabel} type="small">
            TODAY'S OVERVIEW
          </ThemedText>
          <ThemedText style={styles.dateText}>{todayDateFormatted}</ThemedText>
        </View>
        <View style={styles.percentageContainer}>
          <ThemedText style={styles.percentageNumber}>{stats.completionPercentage}%</ThemedText>
          <ThemedText style={styles.percentageLabel}>Done</ThemedText>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(100, Math.max(0, stats.completionPercentage))}%` },
          ]}
        />
      </View>

      {/* Metric Cards Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statBox, { backgroundColor: theme.background }]}>
          <ThemedText style={styles.statNumber}>{stats.total}</ThemedText>
          <ThemedText style={styles.statLabel} type="small">
            Total Tasks
          </ThemedText>
        </View>

        <View style={[styles.statBox, { backgroundColor: theme.background }]}>
          <ThemedText style={[styles.statNumber, { color: '#059669' }]}>{stats.completed}</ThemedText>
          <ThemedText style={styles.statLabel} type="small">
            Completed
          </ThemedText>
        </View>

        <View style={[styles.statBox, { backgroundColor: theme.background }]}>
          <ThemedText style={[styles.statNumber, { color: '#D97706' }]}>{stats.pending}</ThemedText>
          <ThemedText style={styles.statLabel} type="small">
            Pending
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateLabel: {
    letterSpacing: 1,
    fontWeight: '700',
    opacity: 0.7,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  percentageContainer: {
    alignItems: 'flex-end',
  },
  percentageNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2563EB',
  },
  percentageLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
    opacity: 0.7,
    fontWeight: '600',
  },
});
