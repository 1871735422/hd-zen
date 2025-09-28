import { Container } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import Footer from './components/pc/Footer';
import Header from './components/pc/Header';
// @ts-ignore
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
  return (
    <html lang='zh-Hans'>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <MuiThemeProvider>
            <Header />
            <Container
              maxWidth={false}
              component='main'
              sx={{
                p: { xs: 0, sm: 0, md: 0, lg: 0 },
                m: { xs: 0, sm: 0, md: 0, lg: 0 },
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
