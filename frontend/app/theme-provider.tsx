'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMemo } from 'react';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xlg: true;
    xl: true;
    xxl: true;
  }

  interface Theme {
    layout: {
      maxWidth: {
        md: number;
        lg: number;
        xlg: number;
        xl: number;
        xxl: number;
      };
      gutterX: {
        md: number;
        lg: number;
        xlg: number;
        xl: number;
        xxl: number;
      };
      headerHeight: {
        md: number;
        lg: number;
        xlg: number;
        xl: number;
        xxl: number;
      };
    };
  }

  interface ThemeOptions {
    layout?: {
      maxWidth?: Partial<Record<'md' | 'lg' | 'xlg' | 'xl' | 'xxl', number>>;
      gutterX?: Partial<Record<'md' | 'lg' | 'xlg' | 'xl' | 'xxl', number>>;
      headerHeight?: Partial<
        Record<'md' | 'lg' | 'xlg' | 'xl' | 'xxl', number>
      >;
    };
  }
}

const createAppTheme = () =>
  createTheme({
    palette: {
      mode: 'light',
    },
    cssVariables: false,
    unstable_strictMode: true,
    breakpoints: {
      values: {
        xs: 0, // 手机 (≥ 0px, < 600px) - 强制使用lg样式
        sm: 600, // 小平板 (≥ 600px, < 960px) - 强制使用lg样式
        md: 960, // 平板 (≥ 960px, < 1280px) - 强制使用lg样式
        // lg: 1280, // 小桌面 (≥ 1280px, < 1600px, 包含 Surface Pro)
        lg: 0, // 强制所有屏幕都使用lg样式
        xlg: 1536, // 中桌面 (≥ 1536px, < 1920px)
        xl: 1920, // 大桌面 (≥ 1920px, < 2560px)
        xxl: 2560, // 超大桌面 (≥ 2560px)
      },
    },
    layout: {
      maxWidth: {
        md: 960, // 960px
        lg: 1240, // 1240px - 优化后更好适配 Surface 等设备
        xlg: 1500, // 1500px - 适合 1536px 屏幕
        xl: 1560, // 1560px - 与新的 xl 断点匹配
        xxl: 2520, // 2520px - 略小于 xxl 断点，留出边距
      },
      gutterX: {
        md: 24,
        lg: 32, // 适合大多数中等屏幕设备
        xlg: 36, // 中等桌面屏幕的间距
        xl: 40, // 更大屏幕使用更大间距
        xxl: 48,
      },
      headerHeight: {
        md: 60,
        lg: 68, // 适合 Surface Pro 等设备
        xlg: 72, // 中等桌面屏幕的头部高度
        xl: 80, // 更大屏幕使用更高的头部
        xxl: 92,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            padding: 0,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(130, 178, 232, 0.6)',
              },
              '&:hover fieldset': {
                borderColor: '#82B2E8',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#82B2E8',
              },
            },
          },
        },
      },
      MuiSelect: {
        defaultProps: {
          MenuProps: {
            disableScrollLock: true,
          },
        },
      },
      MuiMenu: {
        defaultProps: {
          disableScrollLock: true,
        },
      },
      MuiPopover: {
        defaultProps: {
          disableScrollLock: true,
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'none',
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: [
              'PingFang SC',
              'Hiragino Sans GB',
              'Microsoft Yahei',
              'Noto Sans CJK SC',
              '-apple-system',
              'BlinkMacSystemFont',
              'Segoe UI',
              'Helvetica Neue',
              'Arial',
              'Noto Sans',
              'Roboto',
              'system-ui',
              'sans-serif',
            ].join(','),
          },
        },
      },
    },
  });

export default function MuiThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useMemo(() => createAppTheme(), []);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
