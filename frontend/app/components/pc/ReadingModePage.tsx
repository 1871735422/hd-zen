'use client';
import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ReadingModeContainer from './ReadingModeContainer';
import { ReadingModeProvider } from './ReadingModeProvider';

interface ReadingModePageProps {
  title: string;
  tags?: string[];
  summary?: string;
  author?: string;
  date?: string;
  content: string;
}

export default function ReadingModePage({
  title,
  tags,
  summary,
  author,
  date,
  content,
}: ReadingModePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  // 确保只在客户端运行
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleExitReadingMode = useCallback(() => {
    if (typeof window === 'undefined') return;

    // 移除readingMode参数，返回普通阅读模式
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete('readingMode');

    // 构建新的URL，如果没有其他参数则只保留路径
    const newUrl = currentParams.toString()
      ? `?${currentParams.toString()}`
      : window.location.pathname;

    router.push(newUrl);
  }, [router, searchParams]);

  // 隐藏页面滚动条，实现真正的全屏体验
  useEffect(() => {
    if (!isClient) return;

    // 保存原始样式
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalHtmlStyle = window.getComputedStyle(
      document.documentElement
    ).overflow;

    // 隐藏滚动条
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // 添加键盘快捷键支持
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleExitReadingMode();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // 清理函数，恢复原始样式和移除事件监听
    return () => {
      document.body.style.overflow = originalStyle;
      document.documentElement.style.overflow = originalHtmlStyle;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleExitReadingMode, isClient]);

  return (
    <ReadingModeProvider>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          zIndex: 1000,
          backgroundColor: 'transparent',
        }}
      >
        <ReadingModeContainer
          title={title}
          tags={tags}
          summary={summary}
          author={author}
          date={date}
          content={content}
          onExitReadingMode={handleExitReadingMode}
        />
      </Box>
    </ReadingModeProvider>
  );
}
