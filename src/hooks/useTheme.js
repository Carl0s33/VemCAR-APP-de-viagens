import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "vemcar-theme";
const LIGHT_CLASS = "light-mode";

function readInitialTheme() {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
  }
  return "dark";
}

function applyTheme(theme) {
  if (typeof document === "undefined") return;
  const body = document.body;
  if (theme === "light") body.classList.add(LIGHT_CLASS);
  else body.classList.remove(LIGHT_CLASS);
}

export function useTheme() {
  const [theme, setThemeState] = useState(readInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
    }
  }, [theme]);

  const setTheme = useCallback((value) => setThemeState(value), []);
  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    []
  );

  return { theme, setTheme, toggleTheme, isLight: theme === "light" };
}

export function initTheme() {
  applyTheme(readInitialTheme());
}
