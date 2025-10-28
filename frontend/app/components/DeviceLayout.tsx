'use client';

import { useDeviceType } from '@/app/utils/deviceUtils';
import Footer from './pc/Footer';
import Header from './pc/Header';
import MobileFooter from './mobile/Footer';
import MobileHeader from './mobile/Header';

interface DeviceLayoutProps {
  children: React.ReactNode;
}

export default function DeviceLayout({ children }: DeviceLayoutProps) {
  const deviceType = useDeviceType();

  // Mobile/Tablet: 使用移动端布局
  if (deviceType === 'mobile' || deviceType === 'tablet') {
    return (
      <>
        <MobileHeader />
        <main>{children}</main>
        <MobileFooter />
      </>
    );
  }

  // Desktop: 使用PC端布局
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
