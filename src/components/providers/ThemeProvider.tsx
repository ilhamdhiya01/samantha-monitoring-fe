import React, { useCallback, useEffect, useMemo, useState } from "react";

import type { Theme } from "@/const/theme.constant";
import { THEME_STORAGE_KEY } from "@/const/theme.constant";
import { ThemeContext } from "@/lib/hooks/useTheme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Tema awal sudah dipasang skrip di index.html; di sini cukup dibaca.
const readInitialTheme = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Mode privat: tema tetap berlaku untuk sesi ini.
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
