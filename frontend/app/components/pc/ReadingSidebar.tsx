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
      // Also increase any h4 inside the reading content by 2px (cap at 36px)
      const h4s = element.querySelectorAll('h4');
      h4s.forEach(h4 => {
        const h4Size = parseInt(getComputedStyle(h4).fontSize) || 0;
        const newH4Size = Math.min(h4Size + 2, 36);
        (h4 as HTMLElement).style.fontSize = `${newH4Size}px`;
      });
    });
  };

  const handleDecreaseFont = () => {
    const elements = document.querySelectorAll('.reading-content');

    elements.forEach(element => {
      const currentSize = parseInt(getComputedStyle(element).fontSize);

      const newSize = Math.max(currentSize - 2, 10);
      (element as HTMLElement).style.fontSize = `${newSize}px`;
      // Also decrease any h4 inside the reading content by 2px (min 10px)
      const h4s = element.querySelectorAll('h4');
      h4s.forEach(h4 => {
        const h4Size = parseInt(getComputedStyle(h4).fontSize) || 0;
        const newH4Size = Math.max(h4Size - 2, 10);
        (h4 as HTMLElement).style.fontSize = `${newH4Size}px`;
      });
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
    width: { lg: 50, xl: 70, xxl: 80 },
    height: { lg: 50, xl: 70, xxl: 80 },
    color: 'rgba(42, 130, 228, 1)',
    borderRadius: '50%',
    minWidth: 0,
    fontSize: { lg: 10, xl: 14, xxl: 16 },
    lineHeight: { lg: '10px', xl: '14px', xxl: '16px' },
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 0.1,
    fontFamily: 'Montserrat, "Segoe UI", "Arial Narrow", Arial, sans-serif',
    fontWeight: 500,
    '& svg': {
      fontSize: { lg: 14, xl: 18, xxl: 22 },
    },
  };

  return (
    <Stack
      spacing={0.7}
      alignItems='center'
      sx={{
        position: 'absolute',
        right: { lg: -50, xl: -80, xxl: -80 },
        top: 0,
        zIndex: 10,
        fontWeight: 500,
        fontFamily: 'Montserrat, "Segoe UI", "Arial Narrow", Arial, sans-serif',
        '& .MuiButton-root:hover': { backgroundColor: '#E0F3FF' },
        '& span': {
          transform: 'scaleX(1.2)',
          fontWeight: 400,
        },
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
          fontSize: { lg: 17, xl: 24, xxl: 28 },
        }}
      >
        <span>A+</span>
      </Button>

      <Button
        onClick={handleDecreaseFont}
        disableElevation
        sx={{
          ...buttonStyle,
          bgcolor: defaultBg,
          fontSize: { lg: 14, xl: 20, xxl: 24 },
          lineHeight: 1,
        }}
      >
        <span>A-</span>
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
