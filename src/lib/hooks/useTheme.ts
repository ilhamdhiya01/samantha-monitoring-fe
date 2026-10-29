import { createContext, useContext } from "react";

import type { Theme } from "@/const/theme.constant";

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

// Disediakan oleh ThemeProvider (main.tsx).
export const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);
