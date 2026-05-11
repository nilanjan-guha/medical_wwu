import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../src/store/themeStore";
import { makeTheme } from "../../src/theme/theme";

export default function TabsLayout() {
  const mode = useThemeStore((state) => state.mode);
  const theme = makeTheme(mode);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="checkin"
        options={{
          title: "Check-In",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pulse" color={color} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="healing"
        options={{
          title: "Healing",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="musical-notes" color={color} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: "Journal",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" color={color} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          title: "Emergency",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alert-circle" color={color} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          )
        }}
      />
    </Tabs>
  );
}
