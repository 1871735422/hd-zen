'use client';
import { Box, Button, IconButton, Stack } from '@mui/material';
import SettingIcon from '../icons/SettingIcon';
import {
  BACKGROUND_THEMES,
  BackgroundTheme,
  useReadingMode,
} from './ReadingModeProvider';

interface ReadingModeSidebarProps {
  onExitReadingMode?: () => void;
}

export default function ReadingModeSidebar({
  onExitReadingMode,
}: ReadingModeSidebarProps) {
  const {
    state,
    setBackgroundTheme,
    increaseFontSize,
    decreaseFontSize,
    increaseLineSpacing,
    decreaseLineSpacing,
  } = useReadingMode();

  const sidebarBg = 'rgba(248, 248, 248, 0.95)';
  const buttonBg = 'rgba(255, 255, 255, 0.8)';
  const activeBg = 'rgba(66, 66, 66, 1)';
  const textColor = 'rgba(66, 66, 66, 1)';
  const activeTextColor = 'rgba(255, 255, 255, 1)';

  const backgroundThemes: {
    theme: BackgroundTheme;
    color: string;
    label: string;
  }[] = [
    { theme: 'white', color: BACKGROUND_THEMES.white, label: '白色' },
    { theme: 'gray', color: BACKGROUND_THEMES.gray, label: '灰色' },
    { theme: 'dark', color: BACKGROUND_THEMES.dark, label: '深色' },
    { theme: 'green', color: BACKGROUND_THEMES.green, label: '护眼' },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 60,
        backgroundColor: sidebarBg,
        borderRadius: '30px 0 0 30px',
        padding: '20px 0',
        zIndex: 1000,
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
        borderLeft: '3px solid rgba(66, 66, 66, 0.1)',
      }}
    >
      <Stack spacing={3} alignItems='center'>
        {/* 设置图标 */}
        <IconButton sx={{ color: 'green' }}>
          <SettingIcon />
        </IconButton>
        {/* 背景色选择器 */}
        <Stack spacing={1} alignItems='center'>
          {backgroundThemes.map(({ theme, color, label }) => (
            <Button
              key={theme}
              onClick={() => setBackgroundTheme(theme)}
              sx={{
                width: 32,
                height: 32,
                minWidth: 0,
                borderRadius: '50%',
                backgroundColor: color,
                border:
                  state.backgroundTheme === theme
                    ? `2px solid ${activeBg}`
                    : '2px solid transparent',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
              title={label}
            />
          ))}
        </Stack>

        {/* 字体大小调整 */}
        <Stack spacing={1} alignItems='center'>
          <Button
            onClick={increaseFontSize}
            sx={{
              width: 40,
              height: 40,
              minWidth: 0,
              borderRadius: '50%',
              backgroundColor: buttonBg,
              color: textColor,
              fontSize: '16px',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: buttonBg,
                opacity: 0.8,
              },
            }}
            title='增大字体'
          >
            A+
          </Button>

          <Button
            onClick={decreaseFontSize}
            sx={{
              width: 40,
              height: 40,
              minWidth: 0,
              borderRadius: '50%',
              backgroundColor: buttonBg,
              color: textColor,
              fontSize: '16px',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: buttonBg,
                opacity: 0.8,
              },
            }}
            title='减小字体'
          >
            A-
          </Button>

          <Button
            sx={{
              width: 40,
              height: 40,
              minWidth: 0,
              borderRadius: '50%',
              backgroundColor: buttonBg,
              color: textColor,
              fontSize: '16px',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: buttonBg,
                opacity: 0.8,
              },
            }}
            title='默认字体'
          >
            B
          </Button>
        </Stack>

        {/* 行间距调整 */}
        <Stack spacing={1} alignItems='center'>
          <Button
            onClick={increaseLineSpacing}
            sx={{
              width: 40,
              height: 40,
              minWidth: 0,
              borderRadius: '50%',
              backgroundColor: buttonBg,
              color: textColor,
              fontSize: '16px',
              '&:hover': {
                backgroundColor: buttonBg,
                opacity: 0.8,
              },
            }}
            title='增加行间距'
          >
            ⇅
          </Button>

          <Button
            onClick={decreaseLineSpacing}
            sx={{
              width: 40,
              height: 40,
              minWidth: 0,
              borderRadius: '50%',
              backgroundColor: buttonBg,
              color: textColor,
              fontSize: '16px',
              '&:hover': {
                backgroundColor: buttonBg,
                opacity: 0.8,
              },
            }}
            title='减少行间距'
          >
            ⇅
          </Button>
        </Stack>

        {/* 返回按钮 */}
        <Button
          onClick={onExitReadingMode}
          sx={{
            width: 50,
            height: 50,
            minWidth: 0,
            borderRadius: '50%',
            backgroundColor: activeBg,
            color: activeTextColor,
            fontSize: '12px',
            fontWeight: 'bold',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: activeBg,
              opacity: 0.8,
              transform: 'scale(1.05)',
            },
          }}
          title='退出阅读模式'
        >
          返回
        </Button>
      </Stack>
    </Box>
  );
}
