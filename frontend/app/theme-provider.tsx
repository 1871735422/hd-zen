'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
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
