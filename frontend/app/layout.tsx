import Clarity from '@microsoft/clarity';
import { Container } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import DesktopFooter from './components/pc/Footer';
import DesktopHeader from './components/pc/Header';
import MobileHeader from './components/mobile/Header';
import TabNavigation from './components/mobile/TabNavigation';
import './globals.css';
import { getDeviceTypeFromHeaders } from './utils/serverDeviceUtils';
import MuiThemeProvider from './theme-provider';

export const metadata = {
  title: '慧灯禅修', // 可选：在这里定义默认 metadata，页面会覆盖 head
  description: '慧灯之光禅修网站 — 专为现代人定制的佛法学修网站',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projectId = 'tncl8cmm4o';

  // 检测设备类型
  const deviceType = await getDeviceTypeFromHeaders();
  const isMobile = deviceType === 'mobile';

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
          ...(isMobile ? {} : { minWidth: '1280px' }),
        }}
      >
        <AppRouterCacheProvider options={{ enableCssLayer: false }}>
          <MuiThemeProvider>
            {/* 根据设备类型渲染不同的 Header */}
            {isMobile ? (
              <>
                <MobileHeader />
                <TabNavigation />
              </>
            ) : (
              <DesktopHeader />
            )}

            <Container
              maxWidth={isMobile ? false : 'xxl'}
              component='main'
              sx={{
                p: isMobile ? 0 : { xs: 0, sm: 0, md: 0, lg: 0, xl: 0, xxl: 0 },
                m: isMobile ? 0 : { xs: 0, sm: 0, md: 0, lg: 0, xl: 0, xxl: 0 },
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              {children}
            </Container>

            {/* 根据设备类型渲染不同的 Footer */}
            {!isMobile && <DesktopFooter />}
          </MuiThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
