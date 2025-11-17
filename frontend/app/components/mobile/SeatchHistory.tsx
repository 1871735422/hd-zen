'use client';

import { STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import { pxToVw } from '@/app/utils/mobileUtils';
import { Box, Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchHistory } from '../../hooks/useSearchHistory';

function SeatchHistory() {
  const { history, clearHistory, isClient } = useSearchHistory();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted || !isClient) {
    return null;
  }

  return (
    <Box
      sx={{
        flex: 1,
        p: pxToVw(24),
        background:
          'linear-gradient(0deg, rgba(250, 252, 255, 1) 0%, rgba(227, 241, 255, 1) 100%)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: pxToVw(15),
        }}
      >
        <Typography
          fontSize={pxToVw(16)}
          fontWeight={700}
          color={STANDARD_TEXT_COLOR}
        >
          搜索历史
        </Typography>
        {history.length > 0 && (
          <Button
            onClick={clearHistory}
            sx={{
              fontSize: pxToVw(12),
              color: 'rgba(192, 197, 207, 1)',
              textTransform: 'none',
              p: 0,
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            清空
          </Button>
        )}
      </Box>
      <Stack direction='row' spacing={pxToVw(10)} flexWrap='wrap'>
        {history.length > 0 ? (
          history.map(keyword => (
            <Link
              key={keyword}
              href={`/search?keywords=${encodeURIComponent(keyword)}`}
              style={{
                backgroundColor: '#fff',
                padding: `${pxToVw(4.5)} ${pxToVw(13)}`,
                borderRadius: pxToVw(20),
                color: STANDARD_TEXT_COLOR,
                fontSize: pxToVw(14),
                textDecoration: 'none',
              }}
            >
              {keyword}
            </Link>
          ))
        ) : (
          <Typography fontSize={pxToVw(14)} color='rgba(192, 197, 207, 1)'>
            暂无搜索记录
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

export default SeatchHistory;
