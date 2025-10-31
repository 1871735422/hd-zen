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
  [theme.breakpoints.up('lg')]: {
    width: 32,
    height: 32,
    fontSize: 17,
  },
  [theme.breakpoints.up('xlg')]: {
    width: 33,
    height: 33,
    fontSize: 17,
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
  [theme.breakpoints.up('lg')]: {
    width: 11,
    height: 11,
  },
  [theme.breakpoints.up('xlg')]: {
    width: 13,
    height: 13,
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
          lg: state.sidebarCollapsed ? -42 : -50,
          xl: state.sidebarCollapsed ? -55 : -66,
          xxl: state.sidebarCollapsed ? -60 : -72,
        },
        top: { lg: 40, xl: 60, xxl: 70 },
        zIndex: 1000,
      }}
    >
      {/* 主工具栏 - 根据收起状态调整高度 */}
      <Box
        sx={{
          width: {
            lg: state.sidebarCollapsed ? 42 : 50,
            xl: state.sidebarCollapsed ? 55 : 66,
            xxl: state.sidebarCollapsed ? 60 : 72,
          },
          zIndex: 1000,
          backgroundColor: sidebarBg,
          borderRadius: {
            lg: '0 20px 20px 0',
            xl: '0 30px 30px 0',
            xxl: '0 35px 35px 0',
          },
          padding: state.sidebarCollapsed
            ? {
                lg: '16px 0',
                xl: '16px 0',
                xxl: '18px 0',
              }
            : {
                lg: '10px 0',
                xl: '10px 0',
                xxl: '12px 0',
              },
          // height: state.sidebarCollapsed
          //   ? { lg: 30, xlg: 35, xl: 40, xxl: 45 }
          //   : 'auto',
          boxShadow: `0px 2px 4px ${sidebarBg.replace('1)', '0.25)')}`,
          display: 'flex',
          alignItems: state.sidebarCollapsed ? 'center' : 'flex-start',
          justifyContent: 'center',
          '& svg': {
            fontSize: { lg: 24, xlg: 24, xl: 32, xxl: 36 },
          },
        }}
      >
        {state.sidebarCollapsed ? (
          /* 收起状态 - 仅显示设置按钮 */
          <IconButton
            onClick={toggleSidebar}
            sx={{
              color: settingText,
              py: 0.25,
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
            spacing={{ lg: 0.5, xlg: 0.6, xl: 0.8, xxl: 1 }}
            alignItems='center'
            sx={{
              py: 0.5,
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
                width: { lg: 40, xlg: 44, xl: 40, xxl: 44 },
                height: { lg: 40, xlg: 44, xl: 40, xxl: 44 },
                // py: 0.3,
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
                  lg: '20px',
                  xl: '30px',
                  xxl: '35px',
                },
                padding: {
                  lg: '12px',
                  xl: '18px',
                  xxl: '20px',
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: { lg: 0.4, xlg: 0.5, xl: 1, xxl: 1.2 },
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
              spacing={{ lg: 0.4, xlg: 0.6, xl: 0.8, xxl: 1 }}
              alignItems='center'
              sx={{
                '&:nth-child(-n+3) span': {
                  transform: 'scaleX(1.15)',
                },
              }}
            >
              <CircleButton onClick={increaseFontSize} title='增大字体'>
                A+
              </CircleButton>

              <CircleButton onClick={decreaseFontSize} title='减小字体'>
                A-
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
              spacing={{ lg: 0.4, xlg: 0.6, xl: 0.8, xxl: 1 }}
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
            width: { lg: 44, xlg: 44, xl: 56, xxl: 62 },
            height: { lg: 66, xlg: 66, xl: 92, xxl: 100 },
            minWidth: 0,
            pt: 1,
            borderTopLeftRadius: 0,
            borderTopRightRadius: state.sidebarCollapsed
              ? { xl: '30px', xxl: '35px' }
              : 0,
            borderBottomRightRadius: {
              lg: '20px',
              xlg: '25px',
              xl: '30px',
              xxl: '35px',
            },
            borderBottomLeftRadius: 0,
            backgroundColor: sidebarBackBg,
            color: sidebarBackText,
            fontSize: { lg: 16, xlg: 16, xl: 20, xxl: 22 },
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginTop: { lg: -1, xlg: -1.8, xl: -1.8, xxl: -2 },
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
            width: { lg: 60, xlg: 60, xl: 60, xxl: 70 },
            height: { lg: 90, xlg: 90, xl: 90, xxl: 100 },
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
