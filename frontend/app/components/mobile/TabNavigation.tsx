'use client';

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { usePathname, useRouter } from 'next/navigation';
import { STANDARD_TEXT_COLOR } from '../../constants/colors';
import { pxToVw } from '../../utils/mobileUtils';

const tabs = [
  { label: '首页', href: '/' },
  { label: '慧灯禅修课', href: '/course/1' },
  { label: '禅修课问答', href: '/qa/1' },
  { label: '学修参考', href: '/reference' },
  { label: '下载', href: '/download' },
  { label: '不懂就问', href: '/ask' },
];

export default function TabNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  // 判断当前激活的 tab
  const getActiveTab = () => {
    if (pathname === '/') return 0;
    if (pathname.startsWith('/course')) return 1;
    if (pathname.startsWith('/qa')) return 2;
    if (pathname.startsWith('/reference')) return 3;
    if (pathname.startsWith('/download')) return 4;
    if (pathname.startsWith('/ask')) return 5;
    return 0;
  };

  const activeIndex = getActiveTab();

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
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          return (
            <Box
              key={tab.href}
              onClick={() => router.push(tab.href)}
              sx={{
                position: 'relative',
                cursor: 'pointer',
                userSelect: 'none',
                whiteSpace: 'nowrap',
                '&:active': {
                  opacity: 0.7,
                },
              }}
            >
              {/* Tab 文字 */}
              <Typography
                sx={{
                  fontSize: pxToVw(20),
                  pb: pxToVw(6),
                  fontWeight: isActive ? 500 : 400,
                  color: isActive
                    ? 'rgba(21, 67, 153, 1)'
                    : STANDARD_TEXT_COLOR,
                  transition: 'color 0.2s',
                }}
              >
                {tab.label}
              </Typography>

              {/* 激活状态的下划线 */}
              {isActive && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: pxToVw(2),
                    backgroundColor: 'rgba(21, 67, 153, 1)',
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
