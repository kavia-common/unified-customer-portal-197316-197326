import { useEffect, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * useTheme manages light/dark theme and persists to localStorage.
 * Returns { theme, toggleTheme }
 */
export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    return saved || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}
