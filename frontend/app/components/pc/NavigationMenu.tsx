'use client';
import {
  CircularProgress,
} from '@mui/material';
import Box from '@mui/material/Box';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import { NAV_COLOR } from '../../constants';
import MenuItemComponent, { Menu } from './MenuItem';



interface NavigationProps {
  menuData: Menu[];
  loading?: boolean;
}

const NavigationMenu: React.FC<NavigationProps> = ({ menuData, loading = false }) => {
  const pathname = usePathname();

  // 简化选中状态计算，确保首页默认选中
  const currentSelectedIndex = useMemo(() => {
    // 如果是首页路径，直接返回0（首页索引）
    if (pathname === '/') {
      return 0;
    }
    // 查找匹配的菜单项（含一级和二级）
    return menuData.findIndex(
      item =>
        item.slug === pathname ||
        (item.subMenu && item.subMenu.some(subItem => subItem.slug === pathname))
    ) ?? null;
  }, [pathname, menuData]);

  const handleClose = () => {
    // 空函数，因为每个MenuItem自己管理状态
  };

  const handleToggle = (idx: number) => {
    // 空函数，因为每个MenuItem自己管理状态
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flex: 6,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress size={20} sx={{ color: NAV_COLOR }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 6,
        justifyContent: 'flex-start',
        px: 4,
        gap: { xs: 0.5, sm: 1, md: 2 },
      }}
    >
      {menuData.map((item, idx) => {
        const isSelected = currentSelectedIndex === idx;

        return (
          <Box key={item.name} sx={{ display: 'flex', alignItems: 'center' }}>
            <MenuItemComponent
              item={item}
              index={idx}
              isSelected={isSelected}
              onToggle={handleToggle}
              onClose={handleClose}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default NavigationMenu;
