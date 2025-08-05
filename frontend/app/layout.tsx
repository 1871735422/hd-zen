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
      <head>
        <title>慧灯禅修</title>
        <meta name='description' content='慧灯禅修网站' />
        <meta name='charset' content='utf-8' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, user-scalable=no'
        />
        {/* Favicon配置 */}
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
        <link rel='icon' type='image/png' href='/favicon.png' />
        <link rel='shortcut icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' href='/favicon.png' />
      </head>
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
                backgroundImage: 'url(/images/course-lesson-bg.jpg)',
                backgroundSize: '100% auto',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '0px 0',
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
