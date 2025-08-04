import { Container } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import Footer from './components/pc/Footer';
import Header from './components/pc/Header';
import './globals.css';
import MuiThemeProvider from './theme-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='zh-Hans'>
      <title>慧灯禅修</title>
      <meta name='description' content='慧灯禅修网站' />
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
