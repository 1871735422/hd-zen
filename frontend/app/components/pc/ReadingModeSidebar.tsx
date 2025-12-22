'use client';
import {
  MOBILE_READING_THEMES,
  READING_THEMES as PC_READING_THEMES,
  ReadingTheme,
} from '@/app/constants/colors';
import { useDevice } from '@/app/components/DeviceProvider';
import { pxToVw } from '@/app/utils/mobileUtils';
import { Box, Button, Drawer, IconButton, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import LineSpaceDecreaseIcon from '../icons/LineSpaceDecreaseIcon';
import LineSpaceIncreaseIcon from '../icons/LineSpaceIncreaseIcon';
import SettingIcon from '../icons/SettingIcon';
import FontSizeSlider from '../mobile/FontSizeSlider';
import FontWeightSlider from '../mobile/FontWeightSlider';
import LineSpacingSlider from '../mobile/LineSpacingSlider';
import { useReadingMode } from './ReadingModeProvider';

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
  overflow: 'hidden', // 确保内部ripple不溢出
  borderRadius: '50%',
  '&:hover': {
    opacity: 0.8,
  },
}));

// PC 主题颜色选择按钮
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

// Mobile 主题颜色选择按钮
const MobileThemeColorButton = styled(Button)(() => ({
  width: 17,
  height: 17,
  border: '1px solid rgba(153, 153, 153, 1)',
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
    setFontSize,
    setFontWeight,
    setLineSpacing,
    setBackgroundTheme,
    increaseFontSize,
    decreaseFontSize,
    increaseLineSpacing,
    decreaseLineSpacing,
    toggleSidebar,
    toggleFontWeight,
  } = useReadingMode();
  const { deviceType } = useDevice();
  const isMobile = deviceType === 'mobile';

  const READING_THEMES = isMobile ? MOBILE_READING_THEMES : PC_READING_THEMES;
  const currentTheme = READING_THEMES[state.backgroundTheme];
  const {
    sidebarBg,
    sidebarText,
    sidebarBackText,
    settingText,
    sidebarBackBg,
    sidebarBtnBg,
  } = currentTheme;

  const backgroundThemes: {
    theme: ReadingTheme;
    color: string;
    label: string;
  }[] = [
    { theme: 'brown', color: READING_THEMES.brown.sidebarBtnBg, label: '棕' },
    { theme: 'white', color: READING_THEMES.white.sidebarBtnBg, label: '白' },
    { theme: 'green', color: READING_THEMES.green.sidebarBtnBg, label: '绿' },
    { theme: 'dark', color: READING_THEMES.dark.sidebarBtnBg, label: '黑' },
  ];

  const themeSelectedBorder =
    state.backgroundTheme === 'dark'
      ? 'rgba(245, 245, 245, 1)'
      : 'rgba(128, 128, 128, 1)'; // 主题颜色选择按钮选中边框色

  if (isMobile) {
    return (
      <>
        <Stack
          sx={{
            position: 'absolute',
            right: 0,
            top: pxToVw(20),
            zIndex: 1000,
          }}
        >
          {/* 设置按钮 */}

          <Button
            onClick={toggleSidebar}
            sx={{
              width: pxToVw(42),
              height: pxToVw(53),
              visibility: state.sidebarCollapsed ? 'hidden' : 'visible',
              minWidth: 0,
              borderTopLeftRadius: pxToVw(20),
              borderBottomLeftRadius: pxToVw(20),
              backgroundColor: currentTheme.sidebarBtnBg,
              color: settingText,
              fontSize: pxToVw(32),
              boxShadow: '0px 2px 4px  rgba(181, 123, 53, 0.4)',
              // boxShadow: `0px 2px 4px  ${currentTheme.tagBg}`,
              zIndex: 2,
            }}
          >
            <SettingIcon />
          </Button>

          <Button
            onClick={onExitReadingMode}
            sx={{
              width: pxToVw(42),
              height: pxToVw(state.sidebarCollapsed ? 65 : 85),
              minWidth: 0,
              mt: state.sidebarCollapsed ? 0 : pxToVw(-20),
              pt: state.sidebarCollapsed ? 0 : pxToVw(20),
              borderTopLeftRadius: pxToVw(20),
              borderBottomLeftRadius: pxToVw(20),
              backgroundColor: sidebarBackBg,
              color: sidebarBackText,
              fontSize: pxToVw(20),
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              zIndex: 1,
            }}
            title='退出阅读模式'
          >
            返回
          </Button>
        </Stack>
        <Drawer
          anchor='bottom'
          open={state.sidebarCollapsed}
          onClose={toggleSidebar}
          sx={{
            zIndex: 9999,
            '& .MuiDrawer-paper': {
              borderTopLeftRadius: pxToVw(30),
              borderTopRightRadius: pxToVw(30),
              pt: pxToVw(28),
              pb: pxToVw(38),
              px: pxToVw(25),
              background: currentTheme.main,
              boxShadow: `0px 2px 20px  ${currentTheme.divider}`,
            },
            '& .MuiSlider-rail': {
              background: sidebarBg,
            },
          }}
        >
          {/* 滑动条容器  字体大小调节 */}
          <FontSizeSlider fontSize={state.fontSize} setFontSize={setFontSize} />
          <Box display={'flex'} alignItems={'center'} my={pxToVw(16)}>
            {/* 四个颜色选择按钮 */}
            <Stack
              sx={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                pr: pxToVw(25),
              }}
            >
              {backgroundThemes.map(({ theme, color, label }) => (
                <MobileThemeColorButton
                  key={theme}
                  onClick={() => setBackgroundTheme(theme)}
                  sx={{
                    backgroundColor: `${color} !important`,
                    border:
                      state.backgroundTheme === theme
                        ? `2px solid ${themeSelectedBorder}`
                        : `1px solid ${themeSelectedBorder}`,
                  }}
                  title={label}
                />
              ))}
            </Stack>
            <FontWeightSlider
              fontWeight={state.fontWeight}
              setFontWeight={setFontWeight}
            />
          </Box>
          <LineSpacingSlider
            lineSpacing={state.lineSpacing}
            setLineSpacing={setLineSpacing}
          />
        </Drawer>
      </>
    );
  }

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
              p: 0,
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
                backgroundColor: sidebarBtnBg,
              },
            }}
          >
            {/* 设置按钮 */}
            <IconButton
              onClick={toggleSidebar}
              sx={{
                width: { lg: 40, xlg: 44, xl: 40, xxl: 44 },
                height: { lg: 40, xlg: 44, xl: 40, xxl: 44 },
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
                backgroundColor: sidebarBtnBg,
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
                  fontWeight: state.fontWeight,
                  backgroundColor:
                    state.fontWeight === 400 ? sidebarText : sidebarBtnBg,
                  color: state.fontWeight === 400 ? sidebarBg : sidebarText,
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
