'use client';
import { Button, Stack } from '@mui/material';
import React, { useState } from 'react';

interface ReadingSidebarProps {
  defaultMode?: 'paged' | 'full';
}

export default function ReadingSidebar({
  defaultMode = 'paged',
}: ReadingSidebarProps) {
  const [mode, setMode] = useState<'paged' | 'full'>(defaultMode);

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
    // 调用全局函数来切换模式
    if (typeof window !== 'undefined' && (window as any).handleModeChange) {
      (window as any).handleModeChange(next);
    }
  };

  // 监听全局模式变化，同步本地状态
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleGlobalModeChange = (newMode: 'paged' | 'full') => {
        setMode(newMode);
      };

      (window as any).onModeChange = handleGlobalModeChange;

      return () => {
        delete (window as any).onModeChange;
      };
    }
  }, []);

  return (
    <Stack
      spacing={2}
      alignItems='center'
      sx={{
        position: 'absolute',
        right: -48,
        top: 0,
        zIndex: 10,
        fontWeight: 500,
        '&:hover': {
          opacity: 0.8,
        },
      }}
    >
      <Button
        onClick={() => handleToggleMode('full')}
        disableElevation
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          bgcolor: mode === 'full' ? activeBg : defaultBg,
          color: mode === 'full' ? '#fff' : '#2F7AD5',
          fontSize: 12,
          lineHeight: 1.15,
          minWidth: 0,
          textAlign: 'center',
          '&:hover': { bgcolor: mode === 'full' ? activeBg : defaultBg },
        }}
      >
        阅读
        <br />
        模式
      </Button>
      <Button
        onClick={handleIncreaseFont}
        disableElevation
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          bgcolor: defaultBg,
          color: '#2F7AD5',
          fontFamily: 'Montserrat, system-ui, -apple-system, Segoe UI, Roboto',
          fontSize: 22,
          lineHeight: 1,
          minWidth: 0,
          '&:hover': { bgcolor: defaultBg },
        }}
      >
        A+
      </Button>

      <Button
        onClick={handleDecreaseFont}
        disableElevation
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          bgcolor: defaultBg,
          color: '#2F7AD5',
          fontFamily: 'Montserrat, system-ui, -apple-system, Segoe UI, Roboto',
          fontSize: 22,
          lineHeight: 1,
          minWidth: 0,
          '&:hover': { bgcolor: defaultBg },
        }}
      >
        A-
      </Button>

      <Button
        onClick={() => handleToggleMode('paged')}
        disableElevation
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          bgcolor: mode === 'paged' ? activeBg : defaultBg,
          color: mode === 'paged' ? '#fff' : '#2F7AD5',
          fontSize: 12,
          lineHeight: 1.15,
          minWidth: 0,
          textAlign: 'center',
          '&:hover': { bgcolor: mode === 'paged' ? activeBg : defaultBg },
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
          width: 60,
          height: 60,
          borderRadius: '50%',
          bgcolor: mode === 'full' ? activeBg : defaultBg,
          color: mode === 'full' ? '#fff' : '#2F7AD5',
          fontSize: 12,
          lineHeight: 1.15,
          minWidth: 0,
          textAlign: 'center',
          '&:hover': { bgcolor: mode === 'full' ? activeBg : defaultBg },
        }}
      >
        全文
        <br />
        阅读
      </Button>
    </Stack>
  );
}
