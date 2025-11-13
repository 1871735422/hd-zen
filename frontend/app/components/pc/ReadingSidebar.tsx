'use client';
import { MAIN_BLUE_COLOR } from '@/app/constants/colors';
import { useDeviceType } from '@/app/utils/deviceUtils';
import { pxToVw } from '@/app/utils/mobileUtils';
import {
  Button,
  Drawer,
  IconButton,
  Slider,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import BookExpandIcon from '../icons/BookExpandIcon';

declare global {
  interface Window {
    handleModeChange?: (mode: 'paged' | 'full') => void;
  }
}

const SwitchBtn = styled(Button)(({ className }) => ({
  width: pxToVw(69),
  height: pxToVw(69),
  borderRadius: '50%',
  color: className === 'active' ? '#fff' : 'rgba(91, 150, 217, 1)',
  backgroundColor:
    className === 'active' ? MAIN_BLUE_COLOR : 'rgba(237, 246, 252, 1)',
  '& .MuiTypography-root': {
    fontSize: pxToVw(14),
    fontWeight: 500,
    lineHeight: 1.1,
    padding: pxToVw(20),
  },
}));
interface ReadingSidebarProps {
  defaultMode?: 'paged' | 'full';
}

export default function ReadingSidebar({
  defaultMode = 'full',
}: ReadingSidebarProps) {
  const [mode, setMode] = useState<'paged' | 'full'>(defaultMode);
  const router = useRouter();
  const searchParams = useSearchParams();
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [fontSize, setFontSize] = useState(17);

  const defaultBg = 'rgba(237, 246, 252, 1)';
  const activeBg = 'rgba(130, 178, 232, 1)';

  const handleIncreaseFont = () => {
    const elements = document.querySelectorAll('.reading-content');
    elements.forEach(element => {
      const currentSize = parseInt(getComputedStyle(element).fontSize);
      const newSize = Math.min(currentSize + 2, 36);
      (element as HTMLElement).style.fontSize = `${newSize}px`;
      // Also increase any h4 inside the reading content by 2px (cap at 36px)
      const h4s = element.querySelectorAll('h4');
      h4s.forEach(h4 => {
        const h4Size = parseInt(getComputedStyle(h4).fontSize) || 0;
        const newH4Size = Math.min(h4Size + 2, 36);
        (h4 as HTMLElement).style.fontSize = `${newH4Size}px`;
      });
    });
  };

  const handleDecreaseFont = () => {
    const elements = document.querySelectorAll('.reading-content');

    elements.forEach(element => {
      const currentSize = parseInt(getComputedStyle(element).fontSize);

      const newSize = Math.max(currentSize - 2, 10);
      (element as HTMLElement).style.fontSize = `${newSize}px`;
      // Also decrease any h4 inside the reading content by 2px (min 10px)
      const h4s = element.querySelectorAll('h4');
      h4s.forEach(h4 => {
        const h4Size = parseInt(getComputedStyle(h4).fontSize) || 0;
        const newH4Size = Math.max(h4Size - 2, 10);
        (h4 as HTMLElement).style.fontSize = `${newH4Size}px`;
      });
    });
  };

  const handleToggleMode = (next: 'paged' | 'full') => {
    setMode(next);
    if (window.handleModeChange) {
      window.handleModeChange(next);
    }
  };

  // 监听来自其他组件（如分页栏）的模式变化事件
  useEffect(() => {
    const handleModeChangeEvent = (event: CustomEvent) => {
      const newMode = event.detail.mode;
      setMode(newMode);
    };

    window.addEventListener(
      'readingModeChange',
      handleModeChangeEvent as EventListener
    );

    return () => {
      window.removeEventListener(
        'readingModeChange',
        handleModeChangeEvent as EventListener
      );
    };
  }, []);

  const handleEnterReadingMode = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('readingMode', 'true');
    router.push(`?${currentParams.toString()}`);
  };

  const buttonStyle = {
    width: { lg: 50, xlg: 60, xl: 70, xxl: 80 },
    height: { lg: 50, xlg: 60, xl: 70, xxl: 80 },
    color: 'rgba(42, 130, 228, 1)',
    borderRadius: '50%',
    minWidth: 0,
    fontSize: { lg: 10, xlg: 12, xl: 14, xxl: 16 },
    lineHeight: { lg: '10px', xlg: '12px', xl: '14px', xxl: '16px' },
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 0.1,
    fontFamily: 'Montserrat, "Segoe UI", "Arial Narrow", Arial, sans-serif',
    fontWeight: 500,
    '& svg': {
      fontSize: { lg: 14, xlg: 16, xl: 18, xxl: 22 },
    },
  };

  const buttonStyleMobile = useMemo(
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

  const handleFontSizeChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      const size = typeof newValue === 'number' ? newValue : newValue[0];
      setFontSize(size);

      // 应用字体大小到阅读内容
      const elements = document.querySelectorAll('.reading-content');
      elements.forEach(element => {
        (element as HTMLElement).style.fontSize = `${size}px`;

        // 同时调整 h4 标题的字体大小（保持相对比例）
        const h4s = element.querySelectorAll('h4');
        h4s.forEach(h4 => {
          const h4Size = Math.min(size + 4, 36); // h4 比正文大 4px，最大 36px
          (h4 as HTMLElement).style.fontSize = `${h4Size}px`;
        });
      });
    },
    []
  );

  if (isMobile) {
    return (
      <Stack
        direction='row'
        sx={{
          justifyContent: 'space-between',
        }}
      >
        <Button onClick={handleEnterReadingMode} sx={buttonStyleMobile}>
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
              py: pxToVw(28),
              px: pxToVw(25),
            },
          }}
        >
          {/* 滑动条容器 */}
          {/* 字体大小调节 */}
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            mb={1.5}
          >
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
            <Slider
              value={fontSize}
              onChange={handleFontSizeChange}
              min={10}
              max={28}
              step={1}
              sx={{
                height: pxToVw(34),
                mx: pxToVw(20),
                pb: `0 !important`,
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
          {/* 字体大小调节 */}
          <Stack direction={'row'} alignItems={'center'} gap={2}>
            <SwitchBtn
              className={mode === 'paged' ? 'active' : ''}
              onClick={() => handleToggleMode('paged')}
            >
              <Typography>分页阅读</Typography>
            </SwitchBtn>
            <SwitchBtn
              className={mode === 'full' ? 'active' : ''}
              onClick={() => handleToggleMode('full')}
            >
              <Typography>全文阅读</Typography>
            </SwitchBtn>
          </Stack>
        </Drawer>
      </Stack>
    );
  }
  return (
    <Stack
      spacing={0.7}
      alignItems='center'
      sx={{
        position: 'absolute',
        right: { lg: -60, xlg: -70, xl: -81, xxl: -95 },
        top: 0,
        zIndex: 10,
        fontWeight: 500,
        fontFamily: 'Montserrat, "Segoe UI", "Arial Narrow", Arial, sans-serif',
        '& .MuiButton-root:hover': { backgroundColor: '#E0F3FF' },
        '& span': {
          transform: 'scaleX(1.2)',
          fontWeight: 400,
        },
      }}
    >
      <Button
        onClick={handleEnterReadingMode}
        disableElevation
        sx={{ ...buttonStyle, bgcolor: defaultBg }}
      >
        <BookExpandIcon />
        阅读
        <br />
        模式
      </Button>

      <Button
        onClick={handleIncreaseFont}
        disableElevation
        sx={{
          ...buttonStyle,
          bgcolor: defaultBg,
          fontSize: { lg: 17, xlg: 20, xl: 24, xxl: 28 },
        }}
      >
        <span>A+</span>
      </Button>

      <Button
        onClick={handleDecreaseFont}
        disableElevation
        sx={{
          ...buttonStyle,
          bgcolor: defaultBg,
          fontSize: { lg: 14, xlg: 17, xl: 20, xxl: 24 },
          lineHeight: 1,
        }}
      >
        <span>A-</span>
      </Button>

      <Button
        onClick={() => handleToggleMode('paged')}
        disableElevation
        sx={{
          ...buttonStyle,
          bgcolor: mode === 'paged' ? activeBg : defaultBg,
          color: mode === 'paged' ? '#fff' : 'rgba(42, 130, 228, 1)',
        }}
      >
        分页
        <br />
        阅读
      </Button>

      <Button
        onClick={() => handleToggleMode('full')}
        disableElevation
        sx={{
          ...buttonStyle,
          bgcolor: mode === 'full' ? activeBg : defaultBg,
          color: mode === 'full' ? '#fff' : '#2F7AD5',
        }}
      >
        全文
        <br />
        阅读
      </Button>
    </Stack>
  );
}
