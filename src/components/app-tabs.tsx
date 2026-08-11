import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { ThemedText } from './themed-text';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.backgroundElement,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <ThemedText style={{ color, fontSize: 18 }}>📊</ThemedText>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Tasks List',
          tabBarIcon: ({ color }) => (
            <ThemedText style={{ color, fontSize: 18 }}>📋</ThemedText>
          ),
        }}
      />
      <Tabs.Screen
        name="task/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
