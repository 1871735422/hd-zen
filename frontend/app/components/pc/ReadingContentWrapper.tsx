'use client';
import { useDeviceType } from '@/app/utils/deviceUtils';
import { highlightAllKeywords } from '@/app/utils/highlight';
import { Box, Stack } from '@mui/material';
import React, { useCallback, useState } from 'react';
import LogoEndIcon from '../icons/LogoEndIcon';
import { CustomPagination } from '../shared';
import { useReadingMode } from './ReadingModeProvider';

interface ReadingContentProps {
  introText?: string;
  fullText?: string;
}

// 定义 window 对象的扩展接口
interface WindowWithReadingControls extends Window {
  handleModeChange?: (mode: 'paged' | 'full') => void;
  handleIncreaseFont?: () => void;
  handleDecreaseFont?: () => void;
}

export default function ReadingContent({
  introText,
  fullText,
}: ReadingContentProps) {
  const { state } = useReadingMode();
  const isMobile = useDeviceType() === 'mobile';
  const [currentPage, setCurrentPage] = useState(1);
  const [mode, setMode] = useState<'paged' | 'full'>('full'); // 默认全文模式
  const [isClient, setIsClient] = useState(false);

  // 缓存分页内容
  const [pageCache, setPageCache] = useState<Map<number, string>>(new Map());
  const [totalPages, setTotalPages] = useState(0);
  const [combinedHtml, setCombinedHtml] = useState('');
  const [displayIntro, setDisplayIntro] = useState(introText || '');
  const [displayFull, setDisplayFull] = useState(fullText || '');

  // 确保只在客户端运行
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // 初始化分页缓存
  React.useEffect(() => {
    if (isClient && (introText || fullText)) {
      const htmlRaw = `${introText || ''}${fullText || ''}`;

      // 检查 URL hash 中的 highlight 参数（注意 SearchPage 中使用的是 `#highlight=...`）
      let html = htmlRaw;
      try {
        if (
          typeof window !== 'undefined' &&
          window.location &&
          window.location.hash
        ) {
          const m = window.location.hash.match(/highlight=([^&]+)/);
          if (m && m[1]) {
            const decoded = decodeURIComponent(m[1]);
            const kw = decoded ? [decoded] : [];
            if (kw.length) {
              html = highlightAllKeywords(htmlRaw, kw);
              setDisplayIntro(highlightAllKeywords(introText || '', kw));
              setDisplayFull(highlightAllKeywords(fullText || '', kw));
            } else {
              setDisplayIntro(introText || '');
              setDisplayFull(fullText || '');
            }
          } else {
            setDisplayIntro(introText || '');
            setDisplayFull(fullText || '');
          }
        }
      } catch (e) {
        console.error(e);
        setDisplayIntro(introText || '');
        setDisplayFull(fullText || '');
      }

      setCombinedHtml(html);

      const pages = getTotalPages(html);
      setTotalPages(pages);

      // 预缓存前几页
      const newCache = new Map<number, string>();
      for (let i = 1; i <= Math.min(pages, 3); i++) {
        newCache.set(i, getPaginatedContent(html, i));
      }
      setPageCache(newCache);
    }
  }, [isClient, introText, fullText]);

  // 如果 hash 中包含 highlight，滚动到第一个高亮位置（只在全文模式下）
  React.useEffect(() => {
    if (!isClient) return;
    // 仅在全文模式下滚动定位
    if (mode !== 'full') return;

    try {
      const m = window.location.hash.match(/highlight=([^&]+)/);
      if (!(m && m[1])) return;

      // 在下一帧保证 DOM 已更新
      requestAnimationFrame(() => {
        const firstMark = document.querySelector('.reading-content mark');
        if (!firstMark) return;

        // 优先滚动到包含该 mark 的段落（p 或 h 标签），否则滚动到 mark 本身
        const target = (firstMark as Element).closest(
          'p, h1, h2, h3, h4, h5, h6, section, div'
        ) as HTMLElement | null;

        const el = target || (firstMark as HTMLElement);
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const headerOffset = 100; // 适当偏移，避免被固定头部遮挡，可调整
        const top = window.pageYOffset + rect.top - headerOffset;
        window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
      });
    } catch (e) {
      console.error(e);
    }
  }, [isClient, displayIntro, displayFull, mode]);

  // 监听 hashchange，动态响应 highlight 参数变更
  React.useEffect(() => {
    const handler = () => {
      if (!isClient) return;
      try {
        const htmlRaw = `${introText || ''}${fullText || ''}`;
        const m = window.location.hash.match(/highlight=([^&]+)/);
        if (m && m[1]) {
          const decoded = decodeURIComponent(m[1]);
          const kw = decoded ? [decoded] : [];
          const html = kw.length ? highlightAllKeywords(htmlRaw, kw) : htmlRaw;
          setCombinedHtml(html);
          setDisplayIntro(
            kw.length
              ? highlightAllKeywords(introText || '', kw)
              : introText || ''
          );
          setDisplayFull(
            kw.length
              ? highlightAllKeywords(fullText || '', kw)
              : fullText || ''
          );
        } else {
          setCombinedHtml(htmlRaw);
          setDisplayIntro(introText || '');
          setDisplayFull(fullText || '');
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, [isClient, introText, fullText]);

  // 分页逻辑
  const getPlainText = (html: string): string => {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const findBestBreakPoint = (
    html: string,
    plainText: string,
    targetIndex: number,
    minLength: number = 200
  ): number => {
    // 1. 优先查找段落边界
    const paragraphBreaks = [
      ...html.matchAll(/<\/p>/gi),
      ...html.matchAll(/<\/div>/gi),
      ...html.matchAll(/<\/section>/gi),
    ].map(match => match.index! + match[0].length);

    for (const breakPoint of paragraphBreaks) {
      const plainTextLength = getPlainText(html.slice(0, breakPoint)).length;
      if (
        plainTextLength >= targetIndex - minLength &&
        plainTextLength <= targetIndex + minLength
      ) {
        return breakPoint;
      }
    }

    // 2. 查找句子边界
    const sentenceBreaks = [...plainText.matchAll(/[。！？；]/g)].map(
      match => match.index! + 1
    );

    for (const breakPoint of sentenceBreaks) {
      if (
        breakPoint >= targetIndex - minLength &&
        breakPoint <= targetIndex + minLength
      ) {
        // 找到HTML中对应的位置
        let htmlIndex = 0;
        let plainIndex = 0;
        while (htmlIndex < html.length && plainIndex < breakPoint) {
          if (html[htmlIndex] === '<') {
            while (htmlIndex < html.length && html[htmlIndex] !== '>') {
              htmlIndex++;
            }
            htmlIndex++;
          } else {
            plainIndex++;
            htmlIndex++;
          }
        }
        return htmlIndex;
      }
    }

    // 3. 按字符数截取
    let htmlIndex = 0;
    let plainIndex = 0;
    while (htmlIndex < html.length && plainIndex < targetIndex) {
      if (html[htmlIndex] === '<') {
        while (htmlIndex < html.length && html[htmlIndex] !== '>') {
          htmlIndex++;
        }
        htmlIndex++;
      } else {
        plainIndex++;
        htmlIndex++;
      }
    }
    return htmlIndex;
  };

  const getPaginatedContent = (
    html: string,
    page: number,
    charsPerPage: number = 1000
  ): string => {
    const plainText = getPlainText(html);
    const startIndex = (page - 1) * charsPerPage;
    const endIndex = startIndex + charsPerPage;

    if (startIndex >= plainText.length) {
      return '';
    }

    // 找到当前页的开始位置
    const actualStartIndex =
      page === 1 ? 0 : findBestBreakPoint(html, plainText, startIndex);
    const actualEndIndex = findBestBreakPoint(html, plainText, endIndex);

    return html.slice(actualStartIndex, actualEndIndex);
  };

  const getTotalPages = (html: string, charsPerPage: number = 1000): number => {
    const plainText = getPlainText(html);
    return Math.ceil(plainText.length / charsPerPage);
  };

  // 获取缓存的分页内容
  const getCachedPageContent = (page: number): string => {
    if (pageCache.has(page)) {
      return pageCache.get(page)!;
    }

    // 如果缓存中没有，计算并缓存
    const content = getPaginatedContent(combinedHtml, page);
    setPageCache(prev => new Map(prev).set(page, content));
    return content;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    if (mode === 'full') {
      // 全文模式：计算并滚动到对应内容位置
      const articleContainer = document.querySelector(
        '[data-reading-container]'
      );
      if (articleContainer) {
        const readingContent =
          articleContainer.querySelector('.reading-content');
        if (readingContent) {
          // 计算内容总高度和每页应该滚动的位置
          const contentHeight = readingContent.scrollHeight;
          const pageHeight = contentHeight / totalPages;
          const targetScroll = pageHeight * (page - 1);

          // 获取容器相对于页面的位置
          const containerRect = articleContainer.getBoundingClientRect();
          const absoluteTop = window.pageYOffset + containerRect.top;

          // 滚动到目标位置
          window.scrollTo({
            top: absoluteTop + targetScroll,
            behavior: 'smooth',
          });
          return;
        }
      }
    }

    // 分页模式或备用方案：滚动到文章内容开头
    const articleContainer = document.querySelector('[data-reading-container]');
    if (articleContainer) {
      const rect = articleContainer.getBoundingClientRect();
      const scrollTop = window.pageYOffset + rect.top;
      window.scrollTo({ top: scrollTop, behavior: 'smooth' });
    } else {
      // 备用方案：滚动到页面顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleModeChange = useCallback((newMode: 'paged' | 'full') => {
    setMode(newMode);
    setCurrentPage(1); // 切换模式时重置到第一页

    // 触发自定义事件，通知其他组件模式已改变
    const event = new CustomEvent('readingModeChange', {
      detail: { mode: newMode },
    });
    window.dispatchEvent(event);
  }, []);

  // 模拟 ReadingSidebar 的字体控制功能
  const handleIncreaseFont = useCallback(() => {
    const elements = document.querySelectorAll('.reading-content');
    elements.forEach(element => {
      const currentSize = parseInt(getComputedStyle(element).fontSize);
      const newSize = Math.min(currentSize + 2, 36);
      (element as HTMLElement).style.fontSize = `${newSize}px`;
    });
  }, []);

  const handleDecreaseFont = useCallback(() => {
    const elements = document.querySelectorAll('.reading-content');
    elements.forEach(element => {
      const currentSize = parseInt(getComputedStyle(element).fontSize);
      const newSize = Math.max(currentSize - 2, 12);
      (element as HTMLElement).style.fontSize = `${newSize}px`;
    });
  }, []);

  // 将字体控制函数暴露到全局，供 ReadingSidebar 调用
  // 注意：这个 effect 必须在组件挂载时立即执行，不能在 isClient 判断之后
  React.useEffect(() => {
    (window as WindowWithReadingControls).handleIncreaseFont =
      handleIncreaseFont;
    (window as WindowWithReadingControls).handleDecreaseFont =
      handleDecreaseFont;
    (window as WindowWithReadingControls).handleModeChange = handleModeChange;

    // 清理函数
    return () => {
      delete (window as WindowWithReadingControls).handleIncreaseFont;
      delete (window as WindowWithReadingControls).handleDecreaseFont;
      delete (window as WindowWithReadingControls).handleModeChange;
    };
  }, [handleIncreaseFont, handleDecreaseFont, handleModeChange]);

  // 如果不在客户端，不渲染任何内容（让服务端内容显示）
  if (!isClient) {
    return null;
  }

  // 全文模式和分页模式
  return (
    <Box
      textAlign={'justify'}
      sx={{
        '& .reading-content': {
          fontSize: {
            lg: state.fontSize,
            xl: state.fontSize + 2,
            xxl: state.fontSize + 8,
          },
          lineHeight: isMobile ? 1.88 : 2.2,
        },
        '& .reading-content>h4': {
          fontSize: { lg: state.fontSize + 4, xl: state.fontSize + 8 },
          fontWeight: 500,
        },
      }}
    >
      {mode === 'paged' ? (
        <>
          {/* 只显示分页内容 */}
          <Box
            className='reading-content'
            sx={{
              color: 'rgba(68, 68, 68, 1)',
              mb: 5,
            }}
            dangerouslySetInnerHTML={{
              __html: getCachedPageContent(currentPage),
            }}
          />
        </>
      ) : (
        <>
          {/* 全文模式：显示完整内容 */}
          {introText && (
            <Box
              className='reading-content'
              sx={{
                lineHeight: 1.8,
                color: 'rgba(68, 68, 68, 1)',
                mb: 5,
              }}
              dangerouslySetInnerHTML={{ __html: displayIntro }}
            />
          )}
          {fullText && (
            <Box
              className='reading-content'
              sx={{ mr: 2, mb: 5 }}
              dangerouslySetInnerHTML={{ __html: displayFull }}
            />
          )}
        </>
      )}
      {((mode === 'paged' && currentPage === totalPages) ||
        mode === 'full') && (
        <Stack
          direction='row'
          spacing={1.5}
          mt={-1.5}
          mb={5}
          fontSize={{ lg: 32, xl: 38, xxl: 44 }}
          justifyContent='center'
        >
          <LogoEndIcon />
        </Stack>
      )}
      {/* 全文模式下也显示分页 */}
      {totalPages > 1 && (
        <CustomPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          mode={mode}
          onModeChange={handleModeChange}
        />
      )}
    </Box>
  );
}
