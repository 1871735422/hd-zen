import { useCallback, useEffect, useState } from 'react';

const SEARCH_HISTORY_KEY = 'search_history';
const MAX_HISTORY = 5;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Initialize from localStorage on client
  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const addToHistory = useCallback(
    (keyword: string) => {
      if (!isClient) return;

      const trimmed = keyword.trim();
      if (!trimmed) return;

      setHistory(prev => {
        // Remove if already exists, then add to front
        const filtered = prev.filter(item => item !== trimmed);
        const newHistory = [trimmed, ...filtered].slice(0, MAX_HISTORY);

        // Save to localStorage
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
        return newHistory;
      });
    },
    [isClient]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  }, []);

  return { history, addToHistory, clearHistory, isClient };
}
