
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/IconSymbol';
import TabBarBackground from '@/components/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FloatingTabBar from '@/components/FloatingTabBar';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const tabs = [
    {
      name: '(home)',
      title: 'Home',
      icon: 'house.fill',
      route: '/(tabs)/(home)',
    },
    {
      name: 'list',
      title: 'List',
      icon: 'list.bullet',
      route: '/(tabs)/list',
    },
    {
      name: 'favorites',
      title: 'Favorites',
      icon: 'heart.fill',
      route: '/(tabs)/favorites',
    },
    {
      name: 'chats',
      title: 'Chats',
      icon: 'message.fill',
      route: '/(tabs)/chats',
    },
    {
      name: 'profile',
      title: 'Profile',
      icon: 'person.fill',
      route: '/(tabs)/profile',
    },
  ];

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="(home)"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="list"
          options={{
            title: 'List',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet" color={color} />,
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="heart.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="chats"
          options={{
            title: 'Chats',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="message.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
          }}
        />
      </Tabs>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
