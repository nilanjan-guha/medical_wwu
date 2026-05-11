import { DefaultTheme } from "styled-components/native";
import { darkColors, lightColors } from "../constants/colors";

export const makeTheme = (mode: "light" | "dark"): DefaultTheme => ({
  mode,
  colors: mode === "light" ? lightColors : darkColors,
  radius: {
    sm: 8,
    md: 14,
    lg: 20
  },
  spacing: (unit: number) => unit * 8
});

declare module "styled-components/native" {
  export interface DefaultTheme {
    mode: "light" | "dark";
    colors: typeof lightColors;
    radius: {
      sm: number;
      md: number;
      lg: number;
    };
    spacing: (unit: number) => number;
  }
}
