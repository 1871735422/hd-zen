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
        xs: 0,      // 0px
        sm: 600,    // 600px
        md: 960,    // 960px
        lg: 1280,   // 1280px
        xl: 1920,   // 1920px
        xxl: 2560,  // 2560px
      },
    },
    layout: {
      maxWidth: {
        md: 960,    // 960px
        lg: 1280,   // 1280px
        xl: 1920,   // 1920px
        xxl: 2560,  // 2560px
      },
      gutterX: {
        md: 24,
        lg: 32,
        xl: 40,
        xxl: 48,
      },
      headerHeight: {
        md: 60,
        lg: 68,
        xl: 80,
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
