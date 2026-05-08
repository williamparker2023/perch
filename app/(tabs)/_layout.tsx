import { Tabs } from 'expo-router';
import { Compass, Home, PlusSquare, Sparkles, User } from 'lucide-react-native';
import React, { useState } from 'react';

import { CreateSheet } from '@/components/create-sheet';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarLabelPosition: 'beside-icon',
        tabBarStyle: {
          height: 56 + Math.max(insets.bottom / 2, 4),
          paddingTop: 0,
          paddingBottom: Math.max(insets.bottom / 2, 4),
        },
        tabBarItemStyle: {
          alignItems: 'center',
            justifyContent: 'center',
          },
          tabBarIconStyle: {
            marginBottom: 0,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Feed',
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => <Compass size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="create"
          listeners={{
            tabPress: (event) => {
              event.preventDefault();
              setIsCreateOpen(true);
            },
          }}
          options={{
            title: 'Create',
            tabBarIcon: ({ color }) => (
              <PlusSquare size={24} color={isCreateOpen ? Colors[colorScheme ?? 'light'].tint : color} />
            ),
          }}
        />
        <Tabs.Screen
          name="inspo"
          options={{
            title: 'Inspo',
            tabBarIcon: ({ color }) => <Sparkles size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <User size={24} color={color} />,
          }}
        />
      </Tabs>
      <CreateSheet visible={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </>
  );
}
