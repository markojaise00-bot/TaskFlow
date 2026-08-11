import React from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { CategoryFilter, PriorityFilter, SortOption, StatusFilter } from '@/types/task';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

interface TaskFilterBarProps {
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  priorityFilter: PriorityFilter;
  setPriorityFilter: (filter: PriorityFilter) => void;
  categoryFilter: CategoryFilter;
  setCategoryFilter: (filter: CategoryFilter) => void;
  sortOption: SortOption;
  setSortOption: (sort: SortOption) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const STATUSES: StatusFilter[] = ['All', 'Pending', 'Completed'];
const PRIORITIES: PriorityFilter[] = ['All', 'Low', 'Medium', 'High'];
const CATEGORIES: CategoryFilter[] = ['All', 'Work', 'Personal', 'Shopping', 'Health', 'Finance', 'Other'];
const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Date', value: 'createdAt' },
  { label: 'Due Date', value: 'dueDate' },
  { label: 'Priority', value: 'priority' },
  { label: 'A-Z', value: 'alphabetical' },
];

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  sortOption,
  setSortOption,
  searchQuery,
  setSearchQuery,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={[styles.searchBox, { backgroundColor: theme.backgroundElement }]}>
        <ThemedText style={styles.searchIcon}>🔍</ThemedText>
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search tasks or categories..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Status Segment Control */}
      <View style={[styles.segmentContainer, { backgroundColor: theme.backgroundElement }]}>
        {STATUSES.map((status) => {
          const isActive = statusFilter === status;
          return (
            <Pressable
              key={status}
              onPress={() => setStatusFilter(status)}
              style={[
                styles.segmentItem,
                isActive && { backgroundColor: theme.background, shadowColor: '#000' },
              ]}>
              <ThemedText
                style={[
                  styles.segmentText,
                  isActive && styles.activeSegmentText,
                  !isActive && { color: theme.textSecondary },
                ]}>
                {status}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      {/* Category Filters Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}>
        <ThemedText style={styles.filterLabel} type="small">
          Category:
        </ThemedText>
        {CATEGORIES.map((cat) => {
          const isActive = categoryFilter === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => setCategoryFilter(cat)}
              style={[
                styles.pill,
                { backgroundColor: isActive ? '#2563EB' : theme.backgroundElement },
              ]}>
              <ThemedText
                style={[
                  styles.pillText,
                  { color: isActive ? '#FFFFFF' : theme.textSecondary },
                ]}>
                {cat}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Priority & Sorting Bar */}
      <View style={styles.bottomFilterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}>
          <ThemedText style={styles.filterLabel} type="small">
            Priority:
          </ThemedText>
          {PRIORITIES.map((priority) => {
            const isActive = priorityFilter === priority;
            return (
              <Pressable
                key={priority}
                onPress={() => setPriorityFilter(priority)}
                style={[
                  styles.pill,
                  { backgroundColor: isActive ? '#2563EB' : theme.backgroundElement },
                ]}>
                <ThemedText
                  style={[
                    styles.pillText,
                    { color: isActive ? '#FFFFFF' : theme.textSecondary },
                  ]}>
                  {priority}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sortGroup}>
          <ThemedText style={styles.sortLabel} type="small">
            Sort:
          </ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {SORT_OPTIONS.map((opt) => {
              const isActive = sortOption === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => setSortOption(opt.value)}
                  style={[
                    styles.sortPill,
                    { backgroundColor: isActive ? theme.backgroundSelected : theme.backgroundElement },
                  ]}>
                  <ThemedText
                    style={[
                      styles.sortPillText,
                      { color: isActive ? '#2563EB' : theme.textSecondary, fontWeight: isActive ? '700' : '500' },
                    ]}>
                    {opt.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    gap: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 2,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeSegmentText: {
    fontWeight: '700',
    color: '#2563EB',
  },
  bottomFilterRow: {
    gap: 8,
  },
  filterScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  filterLabel: {
    fontWeight: '700',
    fontSize: 12,
    marginRight: 2,
    opacity: 0.7,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sortGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  sortLabel: {
    fontWeight: '700',
    fontSize: 12,
    opacity: 0.7,
  },
  sortPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
  },
  sortPillText: {
    fontSize: 11,
  },
});
