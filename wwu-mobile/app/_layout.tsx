import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { ThemeProvider } from "styled-components/native";
import { Analytics } from "@vercel/analytics/react";
import { authApi } from "../src/api/auth.api";
import { useNotifications } from "../src/hooks/useNotifications";
import { AppProvider } from "../src/context/AppContext";
import { useAuthStore } from "../src/store/authStore";
import { useThemeStore } from "../src/store/themeStore";
import { makeTheme } from "../src/theme/theme";

const RouteGate = () => {
  const segments = useSegments();
  const router = useRouter();
  const { accessToken, user, isHydrated, hydrate } = useAuthStore();

  useNotifications();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const loadProfile = async () => {
      if (accessToken && !user) {
        try {
          const me = await authApi.me();
          useAuthStore.setState({ user: me });
        } catch {
          await useAuthStore.getState().logout();
        }
      }
    };

    loadProfile();
  }, [accessToken, user]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (!accessToken && !inAuthGroup) {
      router.replace("/(auth)/welcome");
    }

    if (accessToken && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [accessToken, isHydrated, router, segments]);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default function RootLayout() {
  const mode = useThemeStore((state) => state.mode);

  return (
    <ThemeProvider theme={makeTheme(mode)}>
      <AppProvider>
        <RouteGate />
        <Analytics />
      </AppProvider>
    </ThemeProvider>
  );
}
