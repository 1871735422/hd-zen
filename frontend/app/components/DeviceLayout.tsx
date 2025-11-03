'use client';

import { useDevice } from '@/app/components/DeviceProvider';
import MobileHeader from './mobile/Header';
import Footer from './pc/Footer';
import Header from './pc/Header';

interface DeviceLayoutProps {
  children: React.ReactNode;
}

export default function DeviceLayout({ children }: DeviceLayoutProps) {
  const { deviceType } = useDevice();

  // Mobile/Tablet: 使用移动端布局
  if (deviceType === 'mobile') {
    return (
      <>
        <MobileHeader />
        <main>{children}</main>
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
