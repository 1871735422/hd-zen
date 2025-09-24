'use client';
import { Button, Stack } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BookExpandIcon from '../icons/BookExpandIcon';

declare global {
  interface Window {
    handleModeChange?: (mode: 'paged' | 'full') => void;
    onModeChange?: (mode: 'paged' | 'full') => void;
  }
}

interface ReadingSidebarProps {
  defaultMode?: 'paged' | 'full';
}

export default function ReadingSidebar({
  defaultMode = 'paged',
}: ReadingSidebarProps) {
  const [mode, setMode] = useState<'paged' | 'full'>(defaultMode);
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultBg = 'rgba(237, 246, 252, 1)';
  const activeBg = 'rgba(130, 178, 232, 1)';

  const handleIncreaseFont = () => {
    const elements = document.querySelectorAll('.reading-content');
    elements.forEach(element => {
      const currentSize = parseInt(getComputedStyle(element).fontSize);
      const newSize = Math.min(currentSize + 2, 36);
      (element as HTMLElement).style.fontSize = `${newSize}px`;
    });
  };

  const handleDecreaseFont = () => {
    const elements = document.querySelectorAll('.reading-content');
    elements.forEach(element => {
      const currentSize = parseInt(getComputedStyle(element).fontSize);
      const newSize = Math.max(currentSize - 2, 12);
      (element as HTMLElement).style.fontSize = `${newSize}px`;
    });
  };

  const handleToggleMode = (next: 'paged' | 'full') => {
    setMode(next);
    if (window.handleModeChange) {
      window.handleModeChange(next);
    }
  };

  const handleEnterReadingMode = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('readingMode', 'true');
    router.push(`?${currentParams.toString()}`);
  };

  useEffect(() => {
    const handleGlobalModeChange = (newMode: 'paged' | 'full') => {
      setMode(newMode);
    };

    window.onModeChange = handleGlobalModeChange;
    return () => {
      delete window.onModeChange;
    };
  }, []);

  const buttonStyle = {
    width: 55,
    height: 55,
    color: 'rgba(42, 130, 228, 1)',
    borderRadius: '50%',
    minWidth: 0,
    fontSize: 12,
    lineHeight: 1.15,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 0.1,
    fontFamily: 'Montserrat, "Segoe UI", "Arial Narrow", Arial, sans-serif',
    fontWeight: 500,
  };

  return (
    <Stack
      spacing={0.7}
      alignItems='center'
      sx={{
        position: 'absolute',
        right: -40,
        top: 0,
        zIndex: 10,
        fontWeight: 500,
        fontFamily: 'Montserrat, "Segoe UI", "Arial Narrow", Arial, sans-serif',
        '& .MuiButton-root:hover': { backgroundColor: '#E0F3FF' },
      }}
    >
      <Button
        onClick={handleEnterReadingMode}
        disableElevation
        sx={{ ...buttonStyle, bgcolor: defaultBg }}
      >
        <BookExpandIcon />
        阅读
        <br />
        模式
      </Button>

      <Button
        onClick={handleIncreaseFont}
        disableElevation
        sx={{
          ...buttonStyle,
          bgcolor: defaultBg,
          color: '#2F7AD5',
          fontSize: 22,
          lineHeight: 1,
        }}
      >
        A+
      </Button>

      <Button
        onClick={handleDecreaseFont}
        disableElevation
        sx={{ ...buttonStyle, bgcolor: defaultBg, fontSize: 22, lineHeight: 1 }}
      >
        A-
      </Button>

      <Button
        onClick={() => handleToggleMode('paged')}
        disableElevation
        sx={{
          ...buttonStyle,
          bgcolor: mode === 'paged' ? activeBg : defaultBg,
          color: mode === 'paged' ? '#fff' : 'rgba(42, 130, 228, 1)',
        }}
      >
        分页
        <br />
        阅读
      </Button>

      <Button
        onClick={() => handleToggleMode('full')}
        disableElevation
        sx={{
          ...buttonStyle,
          bgcolor: mode === 'full' ? activeBg : defaultBg,
          color: mode === 'full' ? '#fff' : '#2F7AD5',
        }}
      >
        全文
        <br />
        阅读
      </Button>
    </Stack>
  );
}
