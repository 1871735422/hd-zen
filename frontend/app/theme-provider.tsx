'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';

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

const theme = createTheme({
  palette: {
    mode: 'light',
  },
  cssVariables: true,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1800,
      xxl: 2560,
    },
  },
  layout: {
    maxWidth: {
      md: 900,
      lg: 1280,
      xl: 1600,
      xxl: 1920,
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
  },
});

export default function MuiThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
