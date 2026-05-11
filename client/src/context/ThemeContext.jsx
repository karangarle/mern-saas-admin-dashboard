import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'mern-saas-theme';

const getPreferredTheme = () => {
  if (typeof window === 'undefined') return 'light';

  const storedTheme = localStorage.getItem(STORAGE_KEY);

  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.classList.add('transition-colors', 'duration-200');
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
};

function useThemeState(enabled = true) {
  const [theme, setTheme] = useState(getPreferredTheme);

  useEffect(() => {
    if (!enabled) return;

    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [enabled, theme]);

  const value = useMemo(() => ({
    theme,
    isDarkMode: theme === 'dark',
    setTheme,
    toggleTheme: () => setTheme((currentTheme) => (
      currentTheme === 'dark' ? 'light' : 'dark'
    )),
  }), [theme]);

  return value;
}

export function ThemeProvider({ children }) {
  const value = useThemeState();

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  const fallback = useThemeState(!context);

  return context || fallback;
}
