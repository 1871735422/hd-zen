'use client';

import React, { createContext, useContext, useState } from 'react';

type SearchFocusContextValue = {
  isSearchFocused: boolean;
  setIsSearchFocused: (v: boolean) => void;
};

const SearchFocusContext = createContext<SearchFocusContextValue | null>(null);

export function SearchFocusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <SearchFocusContext.Provider
      value={{ isSearchFocused, setIsSearchFocused }}
    >
      {children}
    </SearchFocusContext.Provider>
  );
}

export function useSearchFocus() {
  const ctx = useContext(SearchFocusContext);
  if (!ctx) {
    throw new Error('useSearchFocus must be used within SearchFocusProvider');
  }
  return ctx;
}

export default SearchFocusProvider;
