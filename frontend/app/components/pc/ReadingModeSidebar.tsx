'use client';
import { Box, Button, IconButton, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import LineSpaceDecreaseIcon from '../icons/LineSpaceDecreaseIcon';
import LineSpaceIncreaseIcon from '../icons/LineSpaceIncreaseIcon';
import SettingIcon from '../icons/SettingIcon';
import {
  BackgroundTheme,
  READING_THEMES,
  useReadingMode,
} from './ReadingModeProvider';

// 可复用的圆形按钮样式
const CircleButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    width: 28,
    height: 28,
    fontSize: 14,
  },
  [theme.breakpoints.up('md')]: {
    width: 32,
    height: 32,
    fontSize: 16,
  },
  [theme.breakpoints.up('lg')]: {
    width: 36,
    height: 36,
    fontSize: 18,
  },
  [theme.breakpoints.up('xl')]: {
    width: 50,
    height: 50,
    fontSize: 24,
  },
  [theme.breakpoints.up('xxl')]: {
    width: 56,
    height: 56,
    fontSize: 28,
  },
  fontWeight: 300,
  minWidth: 0,
  borderRadius: '50%',
  '&:hover': {
    opacity: 0.8,
  },
}));

// 主题颜色选择按钮
const ThemeColorButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    width: 8,
    height: 8,
  },
  [theme.breakpoints.up('md')]: {
    width: 10,
    height: 10,
  },
  [theme.breakpoints.up('lg')]: {
    width: 12,
    height: 12,
  },
  [theme.breakpoints.up('xl')]: {
    width: 16,
    height: 16,
  },
  [theme.breakpoints.up('xxl')]: {
    width: 18,
    height: 18,
  },
  minWidth: 0,
  borderRadius: '50%',
  '&:hover': {
    opacity: 0.8,
  },
}));

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
    toggleSidebar,
    toggleFontWeight,
  } = useReadingMode();

  const sidebarBg = READING_THEMES[state.backgroundTheme].sidebarBg;
  const sidebarText = READING_THEMES[state.backgroundTheme].sidebarText;
  const sidebarBackText = READING_THEMES[state.backgroundTheme].sidebarBackText;
  const settingText = READING_THEMES[state.backgroundTheme].settingText;
  const sidebarBackBg = READING_THEMES[state.backgroundTheme].sidebarBackBg;
  const buttonBg = READING_THEMES[state.backgroundTheme].sidebarBtnBg;

  const backgroundThemes: {
    theme: BackgroundTheme;
    color: string;
    label: string;
  }[] = [
    { theme: 'brown', color: READING_THEMES.brown.main, label: '棕' },
    { theme: 'white', color: READING_THEMES.white.main, label: '白' },
    { theme: 'green', color: READING_THEMES.green.main, label: '绿' },
    { theme: 'dark', color: READING_THEMES.dark.main, label: '黑' },
  ];

  return (
    <Box
      sx={{
        position: 'absolute',
        right: {
          sm: -35,
          md: -40,
          lg: -50,
          xl: state.sidebarCollapsed ? -55 : -66,
          xxl: state.sidebarCollapsed ? -60 : -72,
        },
        top: { sm: 20, md: 30, lg: 40, xl: 60, xxl: 70 },
        zIndex: 1000,
      }}
    >
      {/* 主工具栏 - 根据收起状态调整高度 */}
      <Box
        sx={{
          width: {
            sm: 35,
            md: 40,
            lg: 50,
            xl: state.sidebarCollapsed ? 55 : 66,
            xxl: state.sidebarCollapsed ? 60 : 72,
          },
          zIndex: 1000,
          backgroundColor: sidebarBg,
          borderRadius: {
            sm: '0 15px 15px 0',
            md: '0 18px 18px 0',
            lg: '0 20px 20px 0',
            xl: '0 30px 30px 0',
            xxl: '0 35px 35px 0',
          },
          padding: state.sidebarCollapsed
            ? {
                sm: '12px 0',
                md: '14px 0',
                lg: '16px 0',
                xl: '16px 0',
                xxl: '18px 0',
              }
            : {
                sm: '8px 0',
                md: '9px 0',
                lg: '10px 0',
                xl: '10px 0',
                xxl: '12px 0',
              },
          height: state.sidebarCollapsed
            ? { sm: 30, md: 35, lg: 40, xl: 40, xxl: 45 }
            : 'auto',
          boxShadow: `0px 2px 4px ${sidebarBg.replace('1)', '0.25)')}`,
          display: 'flex',
          alignItems: state.sidebarCollapsed ? 'center' : 'flex-start',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          '& svg': {
            fontSize: { sm: 16, md: 20, lg: 24, xl: 32, xxl: 36 },
          },
        }}
      >
        {state.sidebarCollapsed ? (
          /* 收起状态 - 仅显示设置按钮 */
          <IconButton
            onClick={toggleSidebar}
            sx={{
              color: settingText,
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <SettingIcon />
          </IconButton>
        ) : (
          /* 展开状态 - 垂直排列所有按钮 */
          <Stack
            spacing={{ sm: 0.4, md: 0.6, lg: 0.8, xl: 0.8, xxl: 1 }}
            alignItems='center'
            sx={{
              '& .MuiButton-text': {
                color: sidebarText,
                backgroundColor: buttonBg,
              },
            }}
          >
            {/* 设置按钮 */}
            <IconButton
              onClick={toggleSidebar}
              sx={{
                width: { sm: 28, md: 32, lg: 40, xl: 40, xxl: 44 },
                height: { sm: 28, md: 32, lg: 40, xl: 40, xxl: 44 },
                color: settingText,
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              <SettingIcon />
            </IconButton>

            {/* 四个颜色选择框 - 框在一起有单独背景 */}
            <Box
              sx={{
                backgroundColor: buttonBg,
                borderRadius: {
                  sm: '15px',
                  md: '18px',
                  lg: '20px',
                  xl: '30px',
                  xxl: '35px',
                },
                padding: {
                  sm: '8px',
                  md: '10px',
                  lg: '12px',
                  xl: '18px',
                  xxl: '20px',
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: { sm: 0.4, md: 0.5, lg: 0.7, xl: 1, xxl: 1.2 },
              }}
            >
              {backgroundThemes.map(({ theme, color, label }) => (
                <ThemeColorButton
                  key={theme}
                  onClick={() => setBackgroundTheme(theme)}
                  sx={{
                    backgroundColor: `${color} !important`,
                    border:
                      state.backgroundTheme === theme
                        ? `1px solid ${sidebarText}`
                        : 'none',
                  }}
                  title={label}
                />
              ))}
            </Box>

            {/* 字体大小调整 */}
            <Stack
              spacing={{ sm: 0.4, md: 0.6, lg: 0.8, xl: 0.8, xxl: 1 }}
              alignItems='center'
              sx={{
                '&:nth-child(-n+3) span': {
                  transform: 'scaleX(1.15)',
                },
              }}
            >
              <CircleButton onClick={increaseFontSize} title='增大字体'>
                <span style={{ fontSize: '27px' }}>A</span>+
              </CircleButton>

              <CircleButton onClick={decreaseFontSize} title='减小字体'>
                <span style={{ fontSize: '20px' }}>A</span>-
              </CircleButton>

              <CircleButton
                onClick={toggleFontWeight}
                sx={{
                  fontWeight: state.fontWeight === 'bold' ? 'bold' : 'normal',
                  backgroundColor:
                    state.fontWeight === 'bold' ? sidebarText : buttonBg,
                  color: state.fontWeight === 'bold' ? sidebarBg : sidebarText,
                }}
                title='字体加粗'
              >
                <span>B</span>
              </CircleButton>
            </Stack>

            {/* 行间距调整 */}
            <Stack
              spacing={{ sm: 0.4, md: 0.6, lg: 0.8, xl: 0.8, xxl: 1 }}
              alignItems='center'
            >
              <CircleButton
                onClick={increaseLineSpacing}
                title='增加行间距'
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: '1em',
                  },
                }}
              >
                <LineSpaceIncreaseIcon />
              </CircleButton>

              <CircleButton
                onClick={decreaseLineSpacing}
                title='减少行间距'
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: '1em',
                  },
                }}
              >
                <LineSpaceDecreaseIcon />
              </CircleButton>
            </Stack>
          </Stack>
        )}
      </Box>

      {/* 返回按钮 - 独立于边栏下方 */}
      <Box sx={{ position: 'relative' }}>
        <Button
          sx={{
            width: { sm: 30, md: 36, lg: 44, xl: 56, xxl: 62 },
            height: { sm: 45, md: 55, lg: 66, xl: 92, xxl: 100 },
            minWidth: 0,
            pt: 1,
            borderRadius: `0 ${state.sidebarCollapsed ? '30px' : '0'} 30px 0`,
            backgroundColor: sidebarBackBg,
            color: sidebarBackText,
            fontSize: { sm: 12, md: 14, lg: 16, xl: 20, xxl: 22 },
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginTop: { sm: -0.5, md: -0.8, lg: -1, xl: -1.8, xxl: -2 },
            zIndex: -1,
            pointerEvents: 'none',
            '&:hover': {
              opacity: 0.8,
            },
          }}
          title='退出阅读模式'
        >
          返回
        </Button>
        {/* 透明的点击层 */}
        <Box
          onClick={onExitReadingMode}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: { sm: 40, md: 50, lg: 60, xl: 60, xxl: 70 },
            height: { sm: 60, md: 75, lg: 90, xl: 90, xxl: 100 },
            zIndex: 1,
            cursor: 'pointer',
            backgroundColor: 'transparent',
          }}
          title='退出阅读模式'
        />
      </Box>
    </Box>
  );
}
