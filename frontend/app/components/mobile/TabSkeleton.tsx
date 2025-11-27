'use client';

import Box from '@mui/material/Box';
import Skeleton from './Skeleton';
import { pxToVw } from '../../utils/mobileUtils';

interface TabSkeletonProps {
  count?: number;
  showActiveIndicator?: boolean;
  activeIndex?: number;
}

export default function TabSkeleton({
  count = 6,
  showActiveIndicator = true,
  activeIndex = 0,
}: TabSkeletonProps) {
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#fff',
        overflowX: 'auto',
        overflowY: 'hidden',
        // 隐藏滚动条
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch', // iOS 平滑滚动
      }}
    >
      <Box
        sx={{
          display: 'flex',
          minWidth: 'max-content',
          pt: pxToVw(11),
          px: pxToVw(15),
          gap: pxToVw(15),
        }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              cursor: 'pointer',
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {/* Tab 文字骨架 */}
            <Skeleton
              width={pxToVw(60 + Math.random() * 40)} // 随机宽度模拟不同长度的文字
              height={pxToVw(20)}
              variant='text'
              animation='wave'
              sx={{
                pb: pxToVw(6),
              }}
            />

            {/* 激活状态的下划线骨架 */}
            {showActiveIndicator && index === activeIndex && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: pxToVw(2),
                }}
              >
                <Skeleton
                  width='100%'
                  height='100%'
                  variant='rectangular'
                  animation='pulse'
                  sx={{
                    backgroundColor: 'rgba(21, 67, 153, 0.3)',
                  }}
                />
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
