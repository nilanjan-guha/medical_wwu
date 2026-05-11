import { create } from "zustand";

type ThemeState = {
  mode: "light" | "dark";
  toggleMode: () => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  mode: "light",
  toggleMode: () =>
    set((state) => ({
      mode: state.mode === "light" ? "dark" : "light"
    }))
}));
