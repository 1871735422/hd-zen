'use client';
import { Button, Stack } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// 全局函数类型声明
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
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // 确保只在客户端运行
  useEffect(() => {
    setIsClient(true);
  }, []);

  const defaultBg = 'rgba(237, 246, 252, 1)';
  const activeBg = 'rgba(130, 178, 232, 1)';

  const handleIncreaseFont = () => {
    if (typeof window === 'undefined') return;

    const elements = document.querySelectorAll('.reading-content');
    elements.forEach(element => {
      const currentSize = parseInt(getComputedStyle(element).fontSize);
      const newSize = Math.min(currentSize + 2, 36);
      (element as HTMLElement).style.fontSize = `${newSize}px`;
    });
  };

  const handleDecreaseFont = () => {
    if (typeof window === 'undefined') return;

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
    if (typeof window !== 'undefined' && window.handleModeChange) {
      window.handleModeChange(next);
    }
  };

  const handleEnterReadingMode = () => {
    if (typeof window === 'undefined') return;

    // 添加readingMode参数到当前URL
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('readingMode', 'true');
    router.push(`?${currentParams.toString()}`);
  };

  // 监听全局模式变化，同步本地状态
  useEffect(() => {
    if (!isClient) return;

    const handleGlobalModeChange = (newMode: 'paged' | 'full') => {
      setMode(newMode);
    };

    window.onModeChange = handleGlobalModeChange;

    return () => {
      delete window.onModeChange;
    };
  }, [isClient]);

  // 服务端渲染时返回空内容
  if (!isClient) {
    return null;
  }

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
        onClick={handleEnterReadingMode}
        disableElevation
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          bgcolor: activeBg,
          color: '#fff',
          fontSize: 12,
          lineHeight: 1.15,
          minWidth: 0,
          textAlign: 'center',
          '&:hover': { bgcolor: activeBg, opacity: 0.8 },
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
