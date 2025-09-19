'use client';
import { Button, Stack, styled } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BookExpandIcon from '../icons/BookExpandIcon';

// 创建styled button组件
const StyledButton = styled(Button)(() => ({
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
}));

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
      spacing={0.7}
      alignItems='center'
      sx={{
        position: 'absolute',
        right: -48,
        top: 0,
        zIndex: 10,
        fontWeight: 500,
        fontFamily: 'Montserrat, "Segoe UI", "Arial Narrow", Arial, sans-serif',
        '& .MuiButton-root:hover': {
          backgroundColor: '#E0F3FF',
        },
      }}
    >
      <StyledButton
        onClick={handleEnterReadingMode}
        disableElevation
        sx={{
          bgcolor: defaultBg,
        }}
      >
        <BookExpandIcon />
        阅读
        <br />
        模式
      </StyledButton>
      <StyledButton
        onClick={handleIncreaseFont}
        disableElevation
        sx={{
          bgcolor: defaultBg,
          color: '#2F7AD5',
          fontSize: 22,
          lineHeight: 1,
          '&:hover': { bgcolor: defaultBg },
        }}
      >
        A+
      </StyledButton>

      <StyledButton
        onClick={handleDecreaseFont}
        disableElevation
        sx={{
          bgcolor: defaultBg,
          fontSize: 22,
          lineHeight: 1,
        }}
      >
        A-
      </StyledButton>

      <StyledButton
        onClick={() => handleToggleMode('paged')}
        disableElevation
        sx={{
          bgcolor: mode === 'paged' ? activeBg : defaultBg,
          color: mode === 'paged' ? '#fff' : 'rgba(42, 130, 228, 1)',
          '&:hover': {
            bgcolor: mode === 'paged' ? `${activeBg} !important` : defaultBg,
          },
        }}
      >
        分页
        <br />
        阅读
      </StyledButton>

      <StyledButton
        onClick={() => handleToggleMode('full')}
        disableElevation
        sx={{
          bgcolor: mode === 'full' ? activeBg : defaultBg,
          color: mode === 'full' ? '#fff' : '#2F7AD5',
          '&:hover': {
            bgcolor: mode === 'full' ? `${activeBg} !important` : defaultBg,
          },
        }}
      >
        全文
        <br />
        阅读
      </StyledButton>
    </Stack>
  );
}
