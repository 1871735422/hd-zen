'use client';
import { createContext, ReactNode, useContext, useState } from 'react';
import { READING_THEMES, ReadingTheme } from '../../constants/colors';

export type BackgroundTheme = ReadingTheme;

export interface ReadingModeState {
  backgroundTheme: BackgroundTheme;
  fontSize: number;
  lineSpacing: number;
  mode: 'paged' | 'full';
  sidebarCollapsed: boolean; // 侧边栏收起状态
  fontWeight: 'normal' | 'bold'; // 字体粗细
}

interface ReadingModeContextType {
  state: ReadingModeState;
  setBackgroundTheme: (theme: BackgroundTheme) => void;
  setFontSize: (size: number) => void;
  setLineSpacing: (spacing: number) => void;
  setMode: (mode: 'paged' | 'full') => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  increaseLineSpacing: () => void;
  decreaseLineSpacing: () => void;
  toggleSidebar: () => void; // 切换侧边栏收起状态
  toggleFontWeight: () => void; // 切换字体粗细
}

const ReadingModeContext = createContext<ReadingModeContextType | undefined>(
  undefined
);

const DEFAULT_STATE: ReadingModeState = {
  backgroundTheme: 'brown',
  fontSize: 18,
  lineSpacing: 2,
  mode: 'paged',
  sidebarCollapsed: false,
  fontWeight: 'normal',
};

interface ReadingModeProviderProps {
  children: ReactNode;
}

export function ReadingModeProvider({ children }: ReadingModeProviderProps) {
  const [state, setState] = useState<ReadingModeState>(DEFAULT_STATE);

  const setBackgroundTheme = (theme: BackgroundTheme) => {
    setState(prev => ({ ...prev, backgroundTheme: theme }));
  };

  const setFontSize = (size: number) => {
    const clampedSize = Math.max(12, Math.min(36, size));
    setState(prev => ({ ...prev, fontSize: clampedSize }));
  };

  const setLineSpacing = (spacing: number) => {
    const clampedSpacing = Math.max(1.2, Math.min(2.5, spacing));
    setState(prev => ({ ...prev, lineSpacing: clampedSpacing }));
  };

  const setMode = (mode: 'paged' | 'full') => {
    setState(prev => ({ ...prev, mode }));
  };

  const increaseFontSize = () => {
    setState(prev => ({ ...prev, fontSize: Math.min(36, prev.fontSize + 2) }));
  };

  const decreaseFontSize = () => {
    setState(prev => ({ ...prev, fontSize: Math.max(12, prev.fontSize - 2) }));
  };

  const increaseLineSpacing = () => {
    setState(prev => ({
      ...prev,
      lineSpacing: Math.min(2.5, prev.lineSpacing + 0.1),
    }));
  };

  const decreaseLineSpacing = () => {
    setState(prev => ({
      ...prev,
      lineSpacing: Math.max(1.2, prev.lineSpacing - 0.1),
    }));
  };

  const toggleSidebar = () => {
    setState(prev => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed,
    }));
  };

  const toggleFontWeight = () => {
    setState(prev => ({
      ...prev,
      fontWeight: prev.fontWeight === 'normal' ? 'bold' : 'normal',
    }));
  };

  const value: ReadingModeContextType = {
    state,
    setBackgroundTheme,
    setFontSize,
    setLineSpacing,
    setMode,
    increaseFontSize,
    decreaseFontSize,
    increaseLineSpacing,
    decreaseLineSpacing,
    toggleSidebar,
    toggleFontWeight,
  };

  return (
    <ReadingModeContext.Provider value={value}>
      {children}
    </ReadingModeContext.Provider>
  );
}

export function useReadingMode() {
  const context = useContext(ReadingModeContext);
  if (context === undefined) {
    throw new Error('useReadingMode must be used within a ReadingModeProvider');
  }
  return context;
}

export { READING_THEMES };
