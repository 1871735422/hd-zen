'use client';

import { STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getCategories } from '../../api';
import LogoIcon from '../icons/LogoIcon';
import { Menu } from './MenuItem';
import NavigationMenu from './NavigationMenu';
import SearchForm from './SearchForm';

const Header: React.FC = () => {
  const [menuData, setMenuData] = useState<Menu[]>([]);
  const searchParams = useSearchParams();

  // 检查是否为阅读模式
  const isReadingMode = searchParams.get('readingMode') === 'true';

  useEffect(() => {
    const fetchMenuData = async () => {
      const data = await getCategories();
      setMenuData(data);
    };

    fetchMenuData();
  }, []); // 空依赖数组确保只在客户端挂载时运行一次

  // 如果是阅读模式，不渲染Header
  if (isReadingMode) {
    return null;
  }

  return (
    <AppBar
      id='back-to-top-anchor'
      position='sticky'
      sx={{
        top: 0,
        maxWidth: 'xxl',
        background: 'transparent',
        boxShadow: 'none',
        width: '100%',
        justifyContent: 'center',
      }}
      component='header'
    >
      <Toolbar
        sx={{
          background: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          minHeight: { sm: 56, md: 60, lg: 54, xl: 76, xxl: 92 },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            width: 'fit-content',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <LogoIcon />
          <Typography
            sx={{ color: STANDARD_TEXT_COLOR }}
            fontWeight={{ xl: 500, lg: 600 }}
            fontSize={{ sm: 20, md: 20, lg: 18, xl: 24, xxl: 28 }}
          >
            <Link href='/'>慧灯禅修</Link>
          </Typography>
        </Box>

        {/* 菜单 */}
        <NavigationMenu menuData={menuData} />

        {/* 搜索框 */}
        <SearchForm />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
