'use client';

import { Box, Button } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { pxToVw } from '../../utils/mobileUtils';
import { useDevice } from '../DeviceProvider';

export interface NavigationButton {
  label: string;
  value: string;
  active?: boolean;
}

interface MobileVolumeNavigationProps {
  type: 'course' | 'qa';
}

const MobileVolumeNavigation: React.FC<MobileVolumeNavigationProps> = ({
  type,
}) => {
  const { deviceType } = useDevice();
  const pathname = usePathname();
  const router = useRouter();
  const [selectedVolume, setSelectedVolume] = useState<string>('1');

  // 从路径中解析当前选中的册
  useEffect(() => {
    if (pathname) {
      const match = pathname.match(/\/(course|qa)\/(\d+)/);
      if (match) {
        setSelectedVolume(match[2]);
      } else {
        setSelectedVolume('1');
      }
    }
  }, [pathname]);

  // 只在移动端显示
  if (deviceType !== 'mobile') {
    return null;
  }

  // 生成导航按钮配置（包含第一册到第四册，其中第5、6册名字不同）
  const volumes: NavigationButton[] = [
    { label: '第一册', value: '1', active: selectedVolume === '1' },
    { label: '第二册', value: '2', active: selectedVolume === '2' },
    { label: '第三册', value: '3', active: selectedVolume === '3' },
    { label: '第四册', value: '4', active: selectedVolume === '4' },
    { label: '寂止的修法', value: '5', active: selectedVolume === '5' },
    { label: '空性的修法', value: '6', active: selectedVolume === '6' },
  ];

  const handleVolumeChange = (value: string) => {
    setSelectedVolume(value);
    router.push(`/${type}/${value}`);
  };

  // 导航按钮样式
  const buttonStyles = (active: boolean) => ({
    minWidth: pxToVw(75),
    height: pxToVw(40),
    fontSize: pxToVw(16),
    fontWeight: 700,
    wordWrap: 'nowrap',
    color: active ? '#fff' : '#444',
    background: active
      ? 'linear-gradient(90deg, rgba(70, 134, 207, 1) 0%, rgba(170, 207, 250, 1) 100%)'
      : '#fff',
    boxShadow: '0px 0px 10px rgba(215, 228, 252, 1)',
    borderRadius: pxToVw(15),
    transition: 'all 0.2s',
    textTransform: 'none',
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: pxToVw(13),
        px: pxToVw(17),
        py: pxToVw(16),
      }}
    >
      {volumes.map((volume, index) => (
        <Button
          key={volume.value}
          onClick={() => handleVolumeChange(volume.value)}
          sx={{
            px: pxToVw(index < 4 ? 12 : 15),
            ...buttonStyles(volume.active || false),
          }}
        >
          {volume.label}
        </Button>
      ))}
    </Box>
  );
};

export default MobileVolumeNavigation;
