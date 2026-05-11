import { Platform } from "react-native";
import { create } from "zustand";
import { User } from "../types";

const ACCESS_KEY = "wwu_access_token";
const REFRESH_KEY = "wwu_refresh_token";

// Storage abstraction - use localStorage for web, SecureStore for native
const storage = {
  getItem: async (key: string) => {
    if (Platform.OS === "web") {
      return typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    }
    const SecureStore = await import("expo-secure-store");
    return SecureStore.default.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, value);
      }
    } else {
      const SecureStore = await import("expo-secure-store");
      await SecureStore.default.setItemAsync(key, value);
    }
  },
  removeItem: async (key: string) => {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } else {
      const SecureStore = await import("expo-secure-store");
      await SecureStore.default.deleteItemAsync(key);
    }
  }
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  setSession: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isHydrated: false,
  setSession: async (user, accessToken, refreshToken) => {
    await storage.setItem(ACCESS_KEY, accessToken);
    await storage.setItem(REFRESH_KEY, refreshToken);
    set({ user, accessToken, refreshToken });
  },
  hydrate: async () => {
    const [accessToken, refreshToken] = await Promise.all([
      storage.getItem(ACCESS_KEY),
      storage.getItem(REFRESH_KEY)
    ]);
    set({ accessToken: accessToken as string | null, refreshToken: refreshToken as string | null, isHydrated: true });
  },
  logout: async () => {
    await storage.removeItem(ACCESS_KEY);
    await storage.removeItem(REFRESH_KEY);
    set({ user: null, accessToken: null, refreshToken: null });
  }
}));
