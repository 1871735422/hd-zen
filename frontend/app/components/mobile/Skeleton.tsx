'use client';

import Box from '@mui/material/Box';
import { keyframes } from '@mui/material/styles';

// 骨架屏动画
const skeletonPulse = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | false;
  sx?: object;
  children?: React.ReactNode;
}

export default function Skeleton({
  width = '100%',
  height = '1.2em',
  variant = 'text',
  animation = 'pulse',
  sx = {},
  children,
}: SkeletonProps) {
  const getSkeletonStyles = () => {
    const baseStyles = {
      width,
      height,
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
      borderRadius:
        variant === 'circular' ? '50%' : variant === 'text' ? '4px' : '8px',
      position: 'relative' as const,
      overflow: 'hidden',
      ...sx,
    };

    if (animation === 'pulse') {
      return {
        ...baseStyles,
        animation: 'skeleton-pulse 1.5s ease-in-out infinite',
        '@keyframes skeleton-pulse': {
          '0%': { opacity: 0.6 },
          '50%': { opacity: 0.8 },
          '100%': { opacity: 0.6 },
        },
      };
    }

    if (animation === 'wave') {
      return {
        ...baseStyles,
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
          animation: `${skeletonPulse} 1.5s ease-in-out infinite`,
        },
      };
    }

    return baseStyles;
  };

  if (children) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <Box sx={getSkeletonStyles()} />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
            pointerEvents: 'none',
          }}
        >
          {children}
        </Box>
      </Box>
    );
  }

  return <Box sx={getSkeletonStyles()} />;
}
