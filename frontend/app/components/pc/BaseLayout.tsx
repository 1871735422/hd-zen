'use client';

import { Box, Container, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { TitleBanner } from '../shared';
import CategorySelector from './CategorySelector';

interface BaseLayoutProps {
  title: string;
  categories?: string[];
  selectedCategory?: string;
  description?: string;
  children: React.ReactNode;
}

function BaseLayout({
  title,
  categories,
  selectedCategory,
  description,
  children,
}: BaseLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageHeight, setImageHeight] = useState<number>(680);

  useEffect(() => {
    const calculateImageHeight = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const width = container.offsetWidth;
      if (width === 0) return;

      // 加载第一张图片来计算实际高度（因为它使用 100% auto）
      const img = new Image();
      img.src = '/images/course-bg-h.webp';

      // 处理图片已缓存的情况
      if (img.complete) {
        const aspectRatio = img.height / img.width;
        const calculatedHeight = width * aspectRatio;
        setImageHeight(calculatedHeight);
      } else {
        img.onload = () => {
          const aspectRatio = img.height / img.width;
          const calculatedHeight = width * aspectRatio;
          setImageHeight(calculatedHeight);
        };
      }
    };

    calculateImageHeight();

    const resizeObserver = new ResizeObserver(() => {
      calculateImageHeight();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', calculateImageHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateImageHeight);
    };
  }, []);

  return (
    <Container
      ref={containerRef}
      maxWidth={'xxl'}
      sx={{
        position: 'relative',
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        m: 0,
        p: '0 !important',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          minHeight: '100%',
          backgroundImage: 'url(/images/course-bg-h.webp)',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          opacity: 1,
          zIndex: 0,
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `
              linear-gradient(
              180deg,
              transparent 0%,
              transparent ${imageHeight}px,
              rgba(245, 247, 251, 1) ${imageHeight}px,
              rgba(241, 247, 254, 1) 45%,
              rgba(241, 247, 251, 1) 100%
            )
          `,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          zIndex: 1,
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          minWidth: { lg: 1060, xlg: 1080, xl: 1400, xxl: 1420 },
          maxWidth: { lg: 1060, xlg: 1080, xl: 1400, xxl: 1420 },
        }}
      >
        <TitleBanner title={title} />
        {description && (
          <Typography
            fontSize={{ sm: 12, md: 14, lg: 14, xl: 18, xxl: 24 }}
            sx={{
              color: 'rgba(127, 173, 235, 1)',
              mt: { sm: -3, md: -4, lg: -4.3, xl: -6, xxl: -8 },
              mb: { sm: 3, md: 4, lg: 4.3, xl: 6, xxl: 8 },
              px: { sm: 1.5, md: 2, lg: 2.1, xl: 3, xxl: 4 },
            }}
          >
            {description?.split('\n')[0]}
            <br />
            {description?.split('\n')[1]}
          </Typography>
        )}
        {categories && (
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory || categories[0]}
          />
        )}
        {children}
      </Box>
    </Container>
  );
}

export default BaseLayout;
