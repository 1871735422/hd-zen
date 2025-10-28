'use client';

import Box from '@mui/material/Box';
import { usePathname, useRouter } from 'next/navigation';
import { pxToVw } from '../../utils/mobileUtils';

const tabs = [
  { label: '首页', href: '/' },
  { label: '慧灯禅修课', href: '/course' },
  { label: '禅修课问答', href: '/qa' },
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
        borderBottom: `1px solid #E0E0E0`,
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
          px: pxToVw(20),
          gap: pxToVw(32),
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
                padding: `${pxToVw(16)} ${pxToVw(4)}`,
                cursor: 'pointer',
                userSelect: 'none',
                whiteSpace: 'nowrap',
                '&:active': {
                  opacity: 0.7,
                },
              }}
            >
              {/* Tab 文字 */}
              <Box
                sx={{
                  fontSize: pxToVw(16),
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#333' : '#666',
                  transition: 'color 0.2s',
                }}
              >
                {tab.label}
              </Box>

              {/* 激活状态的下划线 */}
              {isActive && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: pxToVw(3),
                    backgroundColor: '#1976D2', // 蓝色
                    borderRadius: `${pxToVw(3)} ${pxToVw(3)} 0 0`,
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
