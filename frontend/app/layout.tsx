import Clarity from '@microsoft/clarity';
import { Container } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import Footer from './components/pc/Footer';
import Header from './components/pc/Header';
import './globals.css';
import MuiThemeProvider from './theme-provider';

export const metadata = {
  title: '慧灯禅修', // 可选：在这里定义默认 metadata，页面会覆盖 head
  description: '慧灯之光禅修网站 — 专为现代人定制的佛法学修网站',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projectId = 'tncl8cmm4o';

  Clarity.init(projectId);
  return (
    <html lang='zh-Hans'>
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        <AppRouterCacheProvider options={{ enableCssLayer: false }}>
          <MuiThemeProvider>
            <Header />
            <Container
              maxWidth={'xxl'}
              component='main'
              sx={{
                p: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0, xxl: 0 },
                m: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0, xxl: 0 },
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {children}
            </Container>
            <Footer />
          </MuiThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
