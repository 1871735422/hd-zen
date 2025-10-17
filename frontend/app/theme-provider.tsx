'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMemo } from 'react';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
  }

  interface Theme {
    layout: {
      maxWidth: {
        md: number;
        lg: number;
        xl: number;
        xxl: number;
      };
      gutterX: {
        md: number;
        lg: number;
        xl: number;
        xxl: number;
      };
      headerHeight: {
        md: number;
        lg: number;
        xl: number;
        xxl: number;
      };
    };
  }

  interface ThemeOptions {
    layout?: {
      maxWidth?: Partial<Record<'md' | 'lg' | 'xl' | 'xxl', number>>;
      gutterX?: Partial<Record<'md' | 'lg' | 'xl' | 'xxl', number>>;
      headerHeight?: Partial<Record<'md' | 'lg' | 'xl' | 'xxl', number>>;
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
        xs: 0, // 手机 (≥ 0px, < 600px)
        sm: 600, // 小平板 (≥ 600px, < 960px)
        md: 960, // 平板 (≥ 960px, < 1280px)
        lg: 1280, // 小桌面 (≥ 1280px, < 1600px, 包含 Surface Pro)
        xl: 1600, // 大桌面 (≥ 1600px, < 2560px)
        xxl: 2560, // 超大桌面 (≥ 2560px)
      },
    },
    layout: {
      maxWidth: {
        md: 960, // 960px
        lg: 1240, // 1240px - 优化后更好适配 Surface 等设备
        xl: 1560, // 1560px - 与新的 xl 断点匹配
        xxl: 2520, // 2520px - 略小于 xxl 断点，留出边距
      },
      gutterX: {
        md: 24,
        lg: 32, // 适合大多数中等屏幕设备
        xl: 40, // 更大屏幕使用更大间距
        xxl: 48,
      },
      headerHeight: {
        md: 60,
        lg: 68, // 适合 Surface Pro 等设备
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
