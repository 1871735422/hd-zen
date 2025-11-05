'use client';

import { pxToVw } from '@/app/utils/mobileUtils';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import BookExpandIcon from '../icons/BookExpandIcon';

const MobileReadingControls = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [fontSize, setFontSize] = useState(17);

  const handleEnterReadingMode = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('readingMode', 'true');
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const handleFontSizeChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      const size = typeof newValue === 'number' ? newValue : newValue[0];
      setFontSize(size);
      // 这里可以后续添加实际的字体调节逻辑
    },
    []
  );

  const buttonStyles = useMemo(
    () => ({
      borderRadius: pxToVw(30),
      minWidth: pxToVw(95),
      height: pxToVw(50),
      background: 'rgba(237, 246, 252, 1)',
      color: 'rgba(42, 130, 228, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: pxToVw(8),
      fontSize: pxToVw(14),
      px: pxToVw(14),
      lineHeight: 1.1,
      fontWeight: 400,
    }),
    []
  );

  return (
    <Stack
      direction='row'
      sx={{
        justifyContent: 'space-between',
      }}
    >
      <Button onClick={handleEnterReadingMode} sx={buttonStyles}>
        <BookExpandIcon />
        阅读
        <br />
        模式
      </Button>

      <IconButton
        sx={{
          width: pxToVw(70),
          height: pxToVw(45),
          borderRadius: pxToVw(30),
          background: 'rgba(237, 246, 252, 1)',
          color: 'rgba(42, 130, 228, 1)',
          fontSize: pxToVw(24),
          fontWeight: 400,
          transform: 'scaleX(1.1)',
        }}
        onClick={() => setIsDrawerOpen(true)}
      >
        A
      </IconButton>

      {/* 底部字体调节抽屉 */}
      <Drawer
        anchor='bottom'
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            borderTopLeftRadius: pxToVw(20),
            borderTopRightRadius: pxToVw(20),
            pb: pxToVw(20),
            px: pxToVw(20),
          },
        }}
      >
        <Box sx={{ pt: pxToVw(30), pb: pxToVw(20) }}>
          {/* 字体大小调节 */}
          <Stack direction='row' alignItems='center' spacing={pxToVw(15)}>
            {/* 左侧小 A */}
            <Typography
              sx={{
                fontSize: pxToVw(12),
                fontWeight: 400,
                color: '#000',
                transform: 'scaleX(1.2)',
              }}
            >
              A
            </Typography>

            {/* 滑动条容器 */}
            <Box sx={{ flex: 1, position: 'relative' }}>
              <Slider
                value={fontSize}
                onChange={handleFontSizeChange}
                min={10}
                max={28}
                step={1}
                sx={{
                  height: pxToVw(34),
                  px: 10,
                  '& .MuiSlider-rail': {
                    height: pxToVw(34),
                    borderRadius: pxToVw(20),
                    background:
                      'linear-gradient(95.14deg, rgba(227, 241, 255, 1) 0%, rgba(247, 247, 247, 1) 100%)',
                    opacity: 1,
                  },
                  '& .MuiSlider-track': {
                    display: 'none',
                  },
                  '& .MuiSlider-thumb': {
                    width: pxToVw(34),
                    height: pxToVw(34),
                    borderRadius: '50%',
                    backgroundColor: '#fff',

                    '&:before': {
                      content: `"${fontSize}"`,
                      fontSize: pxToVw(16),
                      fontWeight: 400,
                      color: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  },
                }}
              />
            </Box>

            {/* 右侧大 A */}
            <Typography
              sx={{
                fontSize: pxToVw(18),
                fontWeight: 400,
                color: '#000',
                transform: 'scaleX(1.1)',
              }}
            >
              A
            </Typography>
          </Stack>
        </Box>
      </Drawer>
    </Stack>
  );
};

export default MobileReadingControls;
